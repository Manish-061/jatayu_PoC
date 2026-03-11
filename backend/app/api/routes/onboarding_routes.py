from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.onboarding_schema import (
    AddressStepPayload,
    ApplicationCreateResponse,
    ApplicationResponse,
    ConsentStepPayload,
    DocumentStepPayload,
    FinancialStepPayload,
    MobileStepPayload,
    PersonalStepPayload,
)
from app.services.onboarding_service import (
    create_application,
    get_application_or_404,
    save_address_step,
    save_consent_step,
    save_document_step,
    save_financial_step,
    save_mobile_step,
    save_personal_step,
)


router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.post("", response_model=ApplicationCreateResponse, status_code=status.HTTP_201_CREATED)
def start_application(db: Session = Depends(get_db)) -> ApplicationCreateResponse:
    application = create_application(db)
    return ApplicationCreateResponse(
        application_id=application.id,
        status=application.status,
    )


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: str, db: Session = Depends(get_db)) -> ApplicationResponse:
    application = get_application_or_404(db, application_id)
    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}/mobile", response_model=ApplicationResponse)
def update_mobile(
    application_id: str,
    payload: MobileStepPayload,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = get_application_or_404(db, application_id)
    application = save_mobile_step(db, application, payload)
    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}/documents", response_model=ApplicationResponse)
def update_documents(
    application_id: str,
    payload: DocumentStepPayload,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = get_application_or_404(db, application_id)
    application = save_document_step(db, application, payload)
    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}/personal", response_model=ApplicationResponse)
def update_personal(
    application_id: str,
    payload: PersonalStepPayload,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = get_application_or_404(db, application_id)
    application = save_personal_step(db, application, payload)
    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}/address", response_model=ApplicationResponse)
def update_address(
    application_id: str,
    payload: AddressStepPayload,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = get_application_or_404(db, application_id)
    application = save_address_step(db, application, payload)
    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}/financial", response_model=ApplicationResponse)
def update_financial(
    application_id: str,
    payload: FinancialStepPayload,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = get_application_or_404(db, application_id)
    application = save_financial_step(db, application, payload)
    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}/consent", response_model=ApplicationResponse)
def update_consent(
    application_id: str,
    payload: ConsentStepPayload,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = get_application_or_404(db, application_id)
    application = save_consent_step(db, application, payload)
    return ApplicationResponse.model_validate(application)
