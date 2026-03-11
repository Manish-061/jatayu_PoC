import { useEffect, useState } from "react";

import Loader from "../components/Loader";
import { getApplicationRequest } from "../services/onboardingService";
import { getApplicationId, getOnboardingStatus, syncApplication } from "../store/onboardingStore";

export default function ProcessingPage() {
  const [status, setStatus] = useState(getOnboardingStatus());
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadApplication() {
      try {
        const application = await getApplicationRequest(getApplicationId());
        if (!ignore) {
          syncApplication(application);
          setStatus(application.status);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      }
    }

    loadApplication();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <Loader />
      </div>

      <aside className="content-panel space-y-4">
        <p className="section-kicker">What happens next</p>
        <h2 className="text-2xl font-semibold text-slate-950">
          Application is being reviewed
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          Once screening and KYC checks are completed, the applicant can be moved to
          account funding and activation.
        </p>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Current backend status: <span className="font-semibold">{status ?? "loading"}</span>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="space-y-3">
          {[
            "Identity verification against uploaded documents",
            "Address and profile matching",
            "Internal risk and compliance review",
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
