from datetime import date, datetime
from enum import Enum
from uuid import uuid4

from sqlalchemy import Boolean, Date, DateTime, Enum as SqlEnum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class OnboardingStatus(str, Enum):
    STARTED = "started"
    MOBILE_VERIFIED = "mobile_verified"
    DOCUMENTS_UPLOADED = "documents_uploaded"
    PERSONAL_COMPLETED = "personal_completed"
    ADDRESS_COMPLETED = "address_completed"
    FINANCIAL_COMPLETED = "financial_completed"
    CONSENT_COMPLETED = "consent_completed"
    PROCESSING = "processing"


class OnboardingApplication(Base):
    __tablename__ = "onboarding_applications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    status: Mapped[OnboardingStatus] = mapped_column(
        SqlEnum(OnboardingStatus, name="onboarding_status"),
        default=OnboardingStatus.STARTED,
        nullable=False,
    )
    mobile: Mapped[str | None] = mapped_column(String(10), nullable=True)
    document_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    dob: Mapped[date | None] = mapped_column(Date, nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(120), nullable=True)
    state: Mapped[str | None] = mapped_column(String(120), nullable=True)
    postal_code: Mapped[str | None] = mapped_column(String(6), nullable=True)
    occupation: Mapped[str | None] = mapped_column(String(120), nullable=True)
    income_range: Mapped[str | None] = mapped_column(String(50), nullable=True)
    terms_accepted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verification_allowed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
