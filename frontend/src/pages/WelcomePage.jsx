import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { startApplicationRequest } from "../services/onboardingService";
import { setStartedApplication } from "../store/onboardingStore";

export default function WelcomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleBegin = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await startApplicationRequest();
      setStartedApplication(response.application_id, response.status);
      navigate("/verify-mobile");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-4xl gap-6">
      <div className="hero-panel overflow-hidden">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top,rgba(148,210,189,0.45),transparent_62%)] lg:block" />

        <div className="relative space-y-8 text-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Retail Banking Onboarding
            </span>

            <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Open a bank account with one guided application flow.
            </h2>

            <p className="mx-auto max-w-2xl text-base leading-7 text-slate-300">
              Begin the application and complete each section step by step. Every
              stage is now persisted through the backend and stored against a PostgreSQL
              onboarding record.
            </p>
          </div>

          <button onClick={handleBegin} className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating Application..." : "Begin Application"}
          </button>

          {error ? <p className="text-sm text-rose-200">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
