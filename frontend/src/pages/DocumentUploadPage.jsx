import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UploadBox from "../components/UploadBox";
import { getCaseId, getUploadedDocuments, markDocumentUploaded } from "../store/onboardingStore";
import { uploadDocumentRequest } from "../services/onboardingService";

const requiredDocuments = [
  {
    type: "PAN",
    title: "PAN Card",
    description: "Upload the PAN card image or PDF for tax identity verification.",
  },
  {
    type: "AADHAAR",
    title: "Aadhaar Card",
    description: "Upload the Aadhaar card image or PDF for KYC identity validation.",
  },
];

export default function DocumentUploadPage() {
  const [uploadingType, setUploadingType] = useState("");
  const [uploadedTypes, setUploadedTypes] = useState(() =>
    Object.entries(getUploadedDocuments())
      .filter(([, uploaded]) => uploaded)
      .map(([type]) => type)
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpload = async (documentType, file) => {
    if (!file) {
      setError(`Please upload the ${documentType} document to continue.`);
      return;
    }

    setUploadingType(documentType);
    setError("");

    try {
      await uploadDocumentRequest({
        caseId: getCaseId(),
        documentType,
        file,
      });
      markDocumentUploaded(documentType);
      setUploadedTypes((current) =>
        current.includes(documentType) ? current : [...current, documentType]
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploadingType("");
    }
  };

  const canContinue = uploadedTypes.includes("PAN") && uploadedTypes.includes("AADHAAR");

  return (
    <section className="content-panel space-y-8">
      <div className="space-y-2">
        <p className="section-kicker">Document Upload</p>
        <h2 className="text-3xl font-semibold text-slate-950">Upload mandatory documents</h2>
        <p className="text-sm leading-6 text-slate-500">
          The onboarding case has been created. Upload both required documents to move the case into review.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {requiredDocuments.map((document) => {
          const isUploaded = uploadedTypes.includes(document.type);
          const isUploading = uploadingType === document.type;

          return (
            <div key={document.type} className="space-y-4 rounded-[28px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-950">{document.title}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isUploaded ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {isUploaded ? "Uploaded" : "Pending"}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-500">{document.description}</p>
              </div>

              <UploadBox
                title={`Upload ${document.title}`}
                description="Accepted formats: PDF, PNG, JPG"
                onUpload={(file) => handleUpload(document.type, file)}
              />

              {isUploading ? <p className="text-sm text-slate-500">Uploading {document.title}...</p> : null}
            </div>
          );
        })}
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button
        onClick={() => navigate("/status")}
        className="btn-primary"
        disabled={!canContinue}
      >
        Continue To Status
      </button>
    </section>
  );
}
