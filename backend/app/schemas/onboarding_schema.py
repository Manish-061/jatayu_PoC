from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.onboarding_model import OnboardingStatus


class ApplicationCreateResponse(BaseModel):
    application_id: str
    status: OnboardingStatus


class MobileStepPayload(BaseModel):
    mobile: str = Field(pattern=r"^\d{10}$")


class DocumentStepPayload(BaseModel):
    document_name: str = Field(min_length=1, max_length=255)


class PersonalStepPayload(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    dob: date


class AddressStepPayload(BaseModel):
    address: str = Field(min_length=1)
    city: str = Field(min_length=1, max_length=120)
    state: str = Field(min_length=1, max_length=120)
    postal_code: str = Field(pattern=r"^\d{6}$")


class FinancialStepPayload(BaseModel):
    occupation: str = Field(min_length=1, max_length=120)
    income_range: str = Field(min_length=1, max_length=50)


class ConsentStepPayload(BaseModel):
    terms_accepted: bool
    verification_allowed: bool


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: OnboardingStatus
    mobile: str | None
    document_name: str | None
    full_name: str | None
    dob: date | None
    address: str | None
    city: str | None
    state: str | None
    postal_code: str | None
    occupation: str | None
    income_range: str | None
    terms_accepted: bool
    verification_allowed: bool
    created_at: datetime
    updated_at: datetime
