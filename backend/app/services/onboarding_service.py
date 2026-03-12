from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document_model import Document, DocumentStatus, DocumentType
from app.models.onboarding_model import OnboardingCase, OnboardingStatus
from app.schemas.onboarding_schema import (
    DocumentSummaryResponse,
    OnboardingStartRequest,
    OnboardingStatusResponse,
)


DOCUMENT_STORAGE_ROOT = Path(__file__).resolve().parents[2] / "storage" / "documents"


def create_onboarding_case(
    db: Session,
    customer_id: str,
    payload: OnboardingStartRequest,
) -> OnboardingCase:
    if not payload.consent.terms_accepted or not payload.consent.kyc_consent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Terms acceptance and KYC consent are required.",
        )

    case = OnboardingCase(
        case_id=generate_case_id(),
        customer_id=customer_id,
        status=OnboardingStatus.APPLICATION_RECEIVED,
        full_name=payload.personal_details.full_name,
        date_of_birth=payload.personal_details.date_of_birth,
        gender=payload.personal_details.gender,
        nationality=payload.personal_details.nationality,
        email=payload.contact_details.email,
        phone=payload.contact_details.phone,
        address_line=payload.address_details.address_line,
        city=payload.address_details.city,
        state=payload.address_details.state,
        postal_code=payload.address_details.postal_code,
        country=payload.address_details.country,
        pan_number=payload.identity_details.pan_number,
        aadhaar_number=payload.identity_details.aadhaar_number,
        occupation=payload.financial_details.occupation,
        income_range=payload.financial_details.income_range,
        terms_accepted=payload.consent.terms_accepted,
        kyc_consent=payload.consent.kyc_consent,
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    return case


def get_case_or_404(db: Session, case_id: str) -> OnboardingCase:
    case = db.execute(select(OnboardingCase).where(OnboardingCase.case_id == case_id)).scalar_one_or_none()
    if case is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding case not found.",
        )
    return case


def upload_document_for_case(
    db: Session,
    case: OnboardingCase,
    document_type: DocumentType,
    file: UploadFile,
) -> Document:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document file is required.",
        )

    case_folder = DOCUMENT_STORAGE_ROOT / case.case_id
    case_folder.mkdir(parents=True, exist_ok=True)

    file_extension = Path(file.filename).suffix
    stored_file_name = f"{document_type.value.lower()}-{uuid4().hex}{file_extension}"
    stored_path = case_folder / stored_file_name

    with stored_path.open("wb") as output_file:
        output_file.write(file.file.read())

    existing_document = db.execute(
        select(Document).where(
            Document.case_id == case.id,
            Document.document_type == document_type,
        )
    ).scalar_one_or_none()

    if existing_document is None:
        document = Document(
            case_id=case.id,
            document_type=document_type,
            file_name=file.filename,
            file_path=str(stored_path),
            status=DocumentStatus.UPLOADED,
        )
        db.add(document)
    else:
        existing_document.file_name = file.filename
        existing_document.file_path = str(stored_path)
        existing_document.status = DocumentStatus.UPLOADED
        document = existing_document

    documents = db.execute(select(Document).where(Document.case_id == case.id)).scalars().all()
    if {doc.document_type for doc in documents} | {document_type} >= {DocumentType.PAN, DocumentType.AADHAAR}:
        case.status = OnboardingStatus.DOCUMENTS_UPLOADED

    db.commit()
    db.refresh(document)
    db.refresh(case)
    return document


def build_status_response(db: Session, case: OnboardingCase) -> OnboardingStatusResponse:
    documents = db.execute(
        select(Document).where(Document.case_id == case.id).order_by(Document.created_at.asc())
    ).scalars().all()

    document_items = [
        DocumentSummaryResponse(
            type=document.document_type,
            file_name=document.file_name,
            status=document.status,
            uploaded_at=document.created_at,
        )
        for document in documents
    ]

    return OnboardingStatusResponse(
        case_id=case.case_id,
        customer_id=case.customer_id,
        status=case.status,
        personal_details={
            "full_name": case.full_name,
            "date_of_birth": case.date_of_birth,
            "gender": case.gender,
            "nationality": case.nationality,
        },
        contact_details={
            "email": case.email,
            "phone": case.phone,
        },
        address_details={
            "address_line": case.address_line,
            "city": case.city,
            "state": case.state,
            "postal_code": case.postal_code,
            "country": case.country,
        },
        identity_details={
            "pan_number": case.pan_number,
            "aadhaar_number": case.aadhaar_number,
        },
        financial_details={
            "occupation": case.occupation,
            "income_range": case.income_range,
        },
        consent={
            "terms_accepted": case.terms_accepted,
            "kyc_consent": case.kyc_consent,
        },
        documents=document_items,
        risk_score=case.risk_score,
        decision=case.decision,
        account_number=case.account_number,
    )


def generate_case_id() -> str:
    return f"CASE{uuid4().hex[:8].upper()}"
