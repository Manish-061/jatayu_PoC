import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-page)] text-slate-900">
      <div className="page-background" />

      <div className="relative">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
