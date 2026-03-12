import { useEffect, useRef, useState } from "react";

import DocumentPreviewCard from "../components/DocumentPreviewCard";
import {
  getDocumentFileRequest,
  getOnboardingStatusRequest,
} from "../services/onboardingService";
import { getCaseId, syncStatus } from "../store/onboardingStore";

export default function StatusPage() {
  const [caseStatus, setCaseStatus] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const previewUrlsRef = useRef({});

  useEffect(() => {
    let ignore = false;

    async function loadStatus() {
      try {
        const response = await getOnboardingStatusRequest(getCaseId());
        if (!ignore) {
          syncStatus(response);
          setCaseStatus(response);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadStatus();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadPreviews() {
      if (!caseStatus) {
        return;
      }

      for (const document of caseStatus.documents) {
        if (previewUrlsRef.current[document.id]) {
          continue;
        }

        try {
          const blob = await getDocumentFileRequest(document.id);
          if (ignore) {
            return;
          }

          const objectUrl = URL.createObjectURL(blob);
          previewUrlsRef.current[document.id] = objectUrl;
          setPreviewUrls((current) => ({
            ...current,
            [document.id]: objectUrl,
          }));
        } catch {
          // Keep the status page usable even when a preview cannot be rendered.
        }
      }
    }

    loadPreviews();
    return () => {
      ignore = true;
    };
  }, [caseStatus]);

  useEffect(
    () => () => {
      Object.values(previewUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );

  if (loading) {
    return <section className="content-panel text-center text-slate-600">Loading onboarding status...</section>;
  }

  return (
    <section className="space-y-6">
      <div className="content-panel space-y-4">
        <div className="space-y-2">
          <p className="section-kicker">Onboarding Status</p>
          <h2 className="text-3xl font-semibold text-slate-950">Track your onboarding case</h2>
          <p className="text-sm leading-6 text-slate-500">
            Review the submitted details, uploaded documents, and current workflow state.
          </p>
        </div>

        {caseStatus ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="stat-card">
                <p className="text-sm text-slate-500">Case ID</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{caseStatus.case_id}</p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-slate-500">Current Status</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{caseStatus.status}</p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-slate-500">Documents Uploaded</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{caseStatus.documents.length}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3 rounded-[28px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-6">
                <h3 className="text-lg font-semibold text-slate-950">Submitted Details</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Name:</span> {caseStatus.personal_details.full_name}</p>
                  <p><span className="font-semibold text-slate-900">DOB:</span> {caseStatus.personal_details.date_of_birth}</p>
                  <p><span className="font-semibold text-slate-900">Email:</span> {caseStatus.contact_details.email}</p>
                  <p><span className="font-semibold text-slate-900">Phone:</span> {caseStatus.contact_details.phone}</p>
                  <p><span className="font-semibold text-slate-900">PAN:</span> {caseStatus.identity_details.pan_number}</p>
                  <p><span className="font-semibold text-slate-900">Aadhaar:</span> {caseStatus.identity_details.aadhaar_number}</p>
                </div>
              </div>

              <div className="space-y-3 rounded-[28px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-6">
                <h3 className="text-lg font-semibold text-slate-950">Documents</h3>
                {caseStatus.documents.length > 0 ? (
                  <div className="space-y-3">
                    {caseStatus.documents.map((document) => (
                      <DocumentPreviewCard
                        key={document.id}
                        document={document}
                        previewUrl={previewUrls[document.id]}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No documents uploaded yet.</p>
                )}
              </div>
            </div>
          </>
        ) : null}

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </div>
    </section>
  );
}
