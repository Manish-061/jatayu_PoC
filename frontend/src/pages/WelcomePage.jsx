import { useNavigate } from "react-router-dom";

import { getCaseId, hasStartedCase } from "../store/onboardingStore";

export default function WelcomePage() {
  const navigate = useNavigate();
  const hasExistingCase = hasStartedCase();
  const existingCaseId = getCaseId();

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
              Start a new onboarding application, upload supporting documents, and track the
              case from the customer portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate("/apply")} className="btn-primary">
              Begin Application
            </button>
            {hasExistingCase ? (
              <button onClick={() => navigate("/status")} className="btn-secondary">
                View Status {existingCaseId ? `(${existingCaseId})` : ""}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
