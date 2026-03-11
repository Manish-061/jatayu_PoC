import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepProgressBar from "../components/StepProgressBar";
import { updateConsentRequest } from "../services/onboardingService";
import { getApplicationId, syncApplication } from "../store/onboardingStore";

export default function ConsentPage() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationAllowed, setVerificationAllowed] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const canSubmit = termsAccepted && verificationAllowed;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const application = await updateConsentRequest(getApplicationId(), {
        terms_accepted: true,
        verification_allowed: true,
      });
      syncApplication(application);
      navigate("/processing");
    } catch (requestError) {
      setSubmitError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="content-panel space-y-8">
      <StepProgressBar step={5} />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">Customer consent</h2>
        <p className="text-sm leading-6 text-slate-500">
          Both confirmations are required before the application is submitted.
        </p>
      </div>

      <div className="space-y-4">
        <label className="consent-item">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>
            I confirm that the applicant has reviewed and accepted the account terms
            and conditions.
          </span>
        </label>

        <label className="consent-item">
          <input
            type="checkbox"
            checked={verificationAllowed}
            onChange={(event) => setVerificationAllowed(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>
            I authorize identity verification and secure validation of submitted KYC
            documents.
          </span>
        </label>
      </div>

      {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

      <button
        onClick={handleSubmit}
        className="btn-primary"
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </section>
  );
}
