import re
from random import randint

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
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
    UserProfileUpdateRequest,
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
    existing_user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    user = User(
        full_name=_generate_display_name(payload.email),
        email=payload.email,
        mobile_number=_generate_placeholder_mobile_number(db),
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


@router.patch("/profile", response_model=UserResponse)
def update_profile(
    payload: UserProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    existing_email_user = db.execute(
        select(User).where(User.email == payload.email, User.id != current_user.id)
    ).scalar_one_or_none()
    if existing_email_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    existing_mobile_user = db.execute(
        select(User).where(User.mobile_number == payload.mobile_number, User.id != current_user.id)
    ).scalar_one_or_none()
    if existing_mobile_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this mobile number already exists.",
        )

    current_user.full_name = payload.full_name
    current_user.email = payload.email
    current_user.mobile_number = payload.mobile_number
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


def _generate_display_name(email: str) -> str:
    local_part = email.split("@", 1)[0]
    normalized = re.sub(r"[._-]+", " ", local_part).strip()
    return normalized.title() or "Portal User"


def _generate_placeholder_mobile_number(db: Session) -> str:
    while True:
        candidate = f"9{randint(0, 999999999):09d}"
        existing_user = db.execute(select(User).where(User.mobile_number == candidate)).scalar_one_or_none()
        if existing_user is None:
            return candidate
