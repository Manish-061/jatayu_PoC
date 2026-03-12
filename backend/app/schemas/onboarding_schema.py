from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.document_model import DocumentStatus, DocumentType
from app.models.onboarding_model import OnboardingStatus


class PersonalDetailsPayload(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    date_of_birth: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    gender: str = Field(min_length=1, max_length=50)
    nationality: str = Field(min_length=1, max_length=100)


class ContactDetailsPayload(BaseModel):
    phone: str = Field(pattern=r"^\d{10}$")


class AddressDetailsPayload(BaseModel):
    address_line: str = Field(min_length=1)
    city: str = Field(min_length=1, max_length=120)
    state: str = Field(min_length=1, max_length=120)
    postal_code: str = Field(pattern=r"^\d{6}$")
    country: str = Field(min_length=1, max_length=120)


class IdentityDetailsPayload(BaseModel):
    pan_number: str = Field(pattern=r"^[A-Z]{5}[0-9]{4}[A-Z]$")
    aadhaar_number: str = Field(pattern=r"^\d{12}$")


class FinancialDetailsPayload(BaseModel):
    occupation: str = Field(min_length=1, max_length=120)
    income_range: str = Field(min_length=1, max_length=50)


class ConsentPayload(BaseModel):
    terms_accepted: bool
    kyc_consent: bool


class OnboardingStartRequest(BaseModel):
    personal_details: PersonalDetailsPayload
    contact_details: ContactDetailsPayload
    address_details: AddressDetailsPayload
    identity_details: IdentityDetailsPayload
    financial_details: FinancialDetailsPayload
    consent: ConsentPayload


class OnboardingStartResponse(BaseModel):
    case_id: str
    status: OnboardingStatus
    message: str


class UploadDocumentResponse(BaseModel):
    case_id: str
    document_type: DocumentType
    status: DocumentStatus
    message: str


class DocumentSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    type: DocumentType
    file_name: str
    status: DocumentStatus
    uploaded_at: datetime


class OnboardingStatusResponse(BaseModel):
    case_id: str
    customer_id: str
    status: OnboardingStatus
    personal_details: dict[str, str]
    contact_details: dict[str, str]
    address_details: dict[str, str]
    identity_details: dict[str, str]
    financial_details: dict[str, str]
    consent: dict[str, bool]
    documents: list[DocumentSummaryResponse]
    risk_score: float | None
    decision: str | None
    account_number: str | None
