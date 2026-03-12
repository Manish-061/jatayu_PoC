from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from app.database.db import get_db
from app.models.user_model import User
from app.schemas.auth_schema import (
    AuthTokenResponse,
    RoleOptionResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
    UserRole,
)


router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

ROLE_OPTIONS = [
    RoleOptionResponse(
        value=UserRole.CUSTOMER,
        label="Customer",
        description="Apply for account opening and track onboarding status.",
    ),
    RoleOptionResponse(
        value=UserRole.OPERATIONS,
        label="Operations",
        description="Review escalated onboarding cases and make manual decisions.",
    ),
    RoleOptionResponse(
        value=UserRole.ADMIN,
        label="Admin",
        description="Manage platform-level users, workflows, and configuration.",
    ),
]


@router.get("/roles", response_model=list[RoleOptionResponse])
def list_roles() -> list[RoleOptionResponse]:
    return ROLE_OPTIONS


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)) -> UserResponse:
    existing_user = db.execute(
        select(User).where(
            or_(User.email == payload.email, User.mobile_number == payload.mobile_number)
        )
    ).scalar_one_or_none()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email or mobile number already exists.",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        mobile_number=payload.mobile_number,
        password_hash=get_password_hash(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


@router.post("/login", response_model=AuthTokenResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)) -> AuthTokenResponse:
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    return AuthTokenResponse(
        access_token=create_access_token(user.id),
        user=UserResponse.model_validate(user),
    )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )
    return user


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)
