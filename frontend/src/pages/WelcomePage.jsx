import { useNavigate } from "react-router-dom";

import { getCaseId, hasStartedCase } from "../store/onboardingStore";

export default function WelcomePage() {
  const navigate = useNavigate();
  const hasExistingCase = hasStartedCase();
  const existingCaseId = getCaseId();
  const processSteps = [
    {
      title: "Submit your application",
      description: "Complete the guided onboarding form with identity, address, and financial details.",
    },
    {
      title: "Upload KYC documents",
      description: "Add PAN and Aadhaar files so the platform can validate the submitted information.",
    },
    {
      title: "Verification and review",
      description: "The system checks your data, tracks documents, and moves the case into processing.",
    },
    {
      title: "Track onboarding progress",
      description: "Use the customer portal to review uploaded documents and monitor case status.",
    },
  ];

  return (
    <section className="mx-auto grid max-w-6xl gap-6">
      <div className="hero-panel overflow-hidden">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top,rgba(148,210,189,0.45),transparent_62%)] lg:block" />

        <div className="relative space-y-8 text-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Agentic Onboarding
            </span>

            <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Open a bank account with one guided application flow.
            </h2>

            <p className="mx-auto max-w-2xl text-base leading-7 text-slate-300">
              Jatayu Bank provides a guided digital account opening experience with structured
              data capture, secure document submission, and transparent case tracking.
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

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="content-panel space-y-6">
          <div className="space-y-2">
            <p className="section-kicker">What We Do</p>
            <h3 className="text-2xl font-semibold text-slate-950">A customer portal for faster account opening</h3>
            <p className="text-sm leading-7 text-slate-600">
              The platform helps customers start account opening, provide identity details,
              upload mandatory KYC documents, and follow the onboarding journey from one place.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[24px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                For Customers
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Start a new application, upload documents with previews, and revisit the case
                tracking page any time after sign-in.
              </p>
            </article>

            <article className="rounded-[24px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                For Operations
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The onboarding flow prepares customer data and uploaded KYC artifacts so review
                and downstream processing can happen with less manual back-and-forth.
              </p>
            </article>
          </div>
        </div>

        <div className="content-panel space-y-5">
          <div className="space-y-2">
            <p className="section-kicker">How It Works</p>
            <h3 className="text-2xl font-semibold text-slate-950">Processing flow</h3>
          </div>

          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[24px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(0,119,182,0.1)] text-sm font-semibold text-[var(--color-primary)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-slate-950">{step.title}</h4>
                    <p className="text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
