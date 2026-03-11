import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Jatayu Bank
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Digital Account Opening
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-[rgba(0,119,182,0.15)] bg-[rgba(0,119,182,0.06)] px-4 py-3 text-sm text-slate-700 md:block">
            Guided onboarding with step-by-step progress tracking.
          </div>

          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "rounded-full px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-lg shadow-cyan-900/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            Home
          </NavLink>
        </div>
      </div>
    </header>
  );
}
