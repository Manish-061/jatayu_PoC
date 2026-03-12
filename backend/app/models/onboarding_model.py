from datetime import datetime
from enum import Enum
from uuid import uuid4

from sqlalchemy import DateTime, Enum as SqlEnum, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class OnboardingStatus(str, Enum):
    APPLICATION_RECEIVED = "application_received"
    DOCUMENTS_UPLOADED = "documents_uploaded"
    UNDER_REVIEW = "under_review"


class OnboardingCase(Base):
    __tablename__ = "onboarding_cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    case_id: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    customer_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    status: Mapped[OnboardingStatus] = mapped_column(
        SqlEnum(OnboardingStatus, name="onboarding_case_status"),
        default=OnboardingStatus.APPLICATION_RECEIVED,
        nullable=False,
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    date_of_birth: Mapped[str] = mapped_column(String(10), nullable=False)
    gender: Mapped[str] = mapped_column(String(50), nullable=False)
    nationality: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(10), nullable=False)
    address_line: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    state: Mapped[str] = mapped_column(String(120), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(6), nullable=False)
    country: Mapped[str] = mapped_column(String(120), nullable=False)
    pan_number: Mapped[str] = mapped_column(String(10), nullable=False)
    aadhaar_number: Mapped[str] = mapped_column(String(12), nullable=False)
    occupation: Mapped[str] = mapped_column(String(120), nullable=False)
    income_range: Mapped[str] = mapped_column(String(50), nullable=False)
    terms_accepted: Mapped[bool] = mapped_column(nullable=False)
    kyc_consent: Mapped[bool] = mapped_column(nullable=False)
    risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    decision: Mapped[str | None] = mapped_column(String(100), nullable=True)
    account_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
