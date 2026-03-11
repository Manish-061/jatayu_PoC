export default function Loader() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-[28px] border border-[rgba(0,119,182,0.12)] bg-white px-6 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-[rgba(0,119,182,0.15)] border-t-[var(--color-primary)]" />

      <h3 className="mt-6 text-xl font-semibold text-slate-950">
        Processing verification
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        We are validating the submitted details and syncing the application with
        onboarding systems.
      </p>
    </div>
  );
}
