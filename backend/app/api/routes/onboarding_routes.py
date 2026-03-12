from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.routes.auth_routes import get_current_user
from app.database.db import get_db
from app.models.user_model import User
from app.schemas.onboarding_schema import (
    OnboardingStartRequest,
    OnboardingStartResponse,
    OnboardingStatusResponse,
    UploadDocumentResponse,
)
from app.services.onboarding_service import (
    build_status_response,
    create_onboarding_case,
    get_case_or_404,
    normalize_document_type,
    upload_document_for_case,
)


router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.post("/start", response_model=OnboardingStartResponse, status_code=status.HTTP_201_CREATED)
def start_onboarding(
    payload: OnboardingStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OnboardingStartResponse:
    _ensure_customer_role(current_user)
    case = create_onboarding_case(db, current_user.id, current_user.email, payload)
    return OnboardingStartResponse(
        case_id=case.case_id,
        status=case.status,
        message="Onboarding application created successfully",
    )


@router.post("/upload-document", response_model=UploadDocumentResponse)
def upload_document(
    case_id: str = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UploadDocumentResponse:
    _ensure_customer_role(current_user)
    case = get_case_or_404(db, case_id)
    _ensure_case_access(case.customer_id, current_user)
    document = upload_document_for_case(db, case, normalize_document_type(document_type), file)
    return UploadDocumentResponse(
        case_id=case.case_id,
        document_type=document.document_type,
        status=document.status,
        message=f"{document.document_type.value} document uploaded successfully",
    )


@router.get("/status/{case_id}", response_model=OnboardingStatusResponse)
def get_onboarding_status(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OnboardingStatusResponse:
    case = get_case_or_404(db, case_id)
    _ensure_case_access(case.customer_id, current_user)
    return build_status_response(db, case)


def _ensure_customer_role(current_user: User) -> None:
    if current_user.role.value != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customer users can perform this onboarding action.",
        )


def _ensure_case_access(customer_id: str | None, current_user: User) -> None:
    if current_user.role.value in {"operations", "admin"}:
        return
    if customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this onboarding case.",
        )
