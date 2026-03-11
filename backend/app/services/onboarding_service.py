from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.onboarding_model import OnboardingApplication, OnboardingStatus
from app.schemas.onboarding_schema import (
    AddressStepPayload,
    ConsentStepPayload,
    DocumentStepPayload,
    FinancialStepPayload,
    MobileStepPayload,
    PersonalStepPayload,
)


def create_application(db: Session) -> OnboardingApplication:
    application = OnboardingApplication()
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def get_application_or_404(db: Session, application_id: str) -> OnboardingApplication:
    application = db.get(OnboardingApplication, application_id)
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )
    return application


def save_mobile_step(
    db: Session, application: OnboardingApplication, payload: MobileStepPayload
) -> OnboardingApplication:
    application.mobile = payload.mobile
    application.status = OnboardingStatus.MOBILE_VERIFIED
    db.commit()
    db.refresh(application)
    return application


def save_document_step(
    db: Session, application: OnboardingApplication, payload: DocumentStepPayload
) -> OnboardingApplication:
    _ensure_status(application, OnboardingStatus.MOBILE_VERIFIED)
    application.document_name = payload.document_name
    application.status = OnboardingStatus.DOCUMENTS_UPLOADED
    db.commit()
    db.refresh(application)
    return application


def save_personal_step(
    db: Session, application: OnboardingApplication, payload: PersonalStepPayload
) -> OnboardingApplication:
    _ensure_status(application, OnboardingStatus.DOCUMENTS_UPLOADED)
    application.full_name = payload.full_name
    application.dob = payload.dob
    application.status = OnboardingStatus.PERSONAL_COMPLETED
    db.commit()
    db.refresh(application)
    return application


def save_address_step(
    db: Session, application: OnboardingApplication, payload: AddressStepPayload
) -> OnboardingApplication:
    _ensure_status(application, OnboardingStatus.PERSONAL_COMPLETED)
    application.address = payload.address
    application.city = payload.city
    application.state = payload.state
    application.postal_code = payload.postal_code
    application.status = OnboardingStatus.ADDRESS_COMPLETED
    db.commit()
    db.refresh(application)
    return application


def save_financial_step(
    db: Session, application: OnboardingApplication, payload: FinancialStepPayload
) -> OnboardingApplication:
    _ensure_status(application, OnboardingStatus.ADDRESS_COMPLETED)
    application.occupation = payload.occupation
    application.income_range = payload.income_range
    application.status = OnboardingStatus.FINANCIAL_COMPLETED
    db.commit()
    db.refresh(application)
    return application


def save_consent_step(
    db: Session, application: OnboardingApplication, payload: ConsentStepPayload
) -> OnboardingApplication:
    _ensure_status(application, OnboardingStatus.FINANCIAL_COMPLETED)
    if not payload.terms_accepted or not payload.verification_allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both consents are required before submission.",
        )

    application.terms_accepted = payload.terms_accepted
    application.verification_allowed = payload.verification_allowed
    application.status = OnboardingStatus.PROCESSING
    db.commit()
    db.refresh(application)
    return application


def _ensure_status(application: OnboardingApplication, required_status: OnboardingStatus) -> None:
    if application.status != required_status:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Complete the previous step before this action. Expected status: {required_status.value}.",
        )
