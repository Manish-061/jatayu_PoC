export default function StepProgressBar({ step }) {
  const steps = [
    "Mobile",
    "Documents",
    "Personal",
    "Address",
    "Financial",
    "Consent",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-kicker">Progress Tracker</p>
        <p className="text-sm font-medium text-slate-500">
          Step {step + 1} of {steps.length}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-6">
        {steps.map((label, index) => {
          const isCompleted = index < step;
          const isActive = index === step;

          return (
            <div
              key={label}
              className={[
                "rounded-2xl border px-4 py-3 text-sm transition",
                isActive
                  ? "border-[var(--color-primary)] bg-[rgba(0,119,182,0.08)] text-slate-950 shadow-sm"
                  : isCompleted
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 bg-white text-slate-500",
              ].join(" ")}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-medium">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
