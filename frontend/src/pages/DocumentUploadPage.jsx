import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DocumentPreviewCard from "../components/DocumentPreviewCard";
import UploadBox from "../components/UploadBox";
import {
  getCaseId,
  getUploadedDocuments,
  markDocumentUploaded,
  syncStatus,
} from "../store/onboardingStore";
import {
  getDocumentFileRequest,
  getOnboardingStatusRequest,
  uploadDocumentRequest,
} from "../services/onboardingService";

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
  const [documents, setDocuments] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const previewUrlsRef = useRef({});

  useEffect(() => {
    let ignore = false;

    async function loadDocuments() {
      const caseId = getCaseId();
      if (!caseId) {
        return;
      }

      try {
        const response = await getOnboardingStatusRequest(caseId);
        if (ignore) {
          return;
        }

        syncStatus(response);
        setDocuments(Object.fromEntries(response.documents.map((document) => [document.type, document])));
        setUploadedTypes(response.documents.map((document) => document.type));
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      }
    }

    loadDocuments();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadPreviews() {
      for (const document of Object.values(documents)) {
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
          // Skip preview rendering errors and keep the upload flow usable.
        }
      }
    }

    loadPreviews();
    return () => {
      ignore = true;
    };
  }, [documents]);

  useEffect(
    () => () => {
      Object.values(previewUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );

  const handleUpload = async (documentType, file) => {
    if (!file) {
      setError(`Please upload the ${documentType} document to continue.`);
      return;
    }

    setUploadingType(documentType);
    setError("");
    setSuccessMessage("");

    try {
      const response = await uploadDocumentRequest({
        caseId: getCaseId(),
        documentType,
        file,
      });
      markDocumentUploaded(documentType);
      const localPreviewUrl = URL.createObjectURL(file);
      const previousPreviewUrl = previewUrlsRef.current[response.document_id];
      if (previousPreviewUrl) {
        URL.revokeObjectURL(previousPreviewUrl);
      }
      previewUrlsRef.current[response.document_id] = localPreviewUrl;
      setUploadedTypes((current) =>
        current.includes(documentType) ? current : [...current, documentType]
      );
      setDocuments((current) => ({
        ...current,
        [documentType]: {
          id: response.document_id,
          type: response.document_type,
          file_name: response.file_name,
          status: response.status,
        },
      }));
      setPreviewUrls((current) => ({
        ...current,
        [response.document_id]: localPreviewUrl,
      }));
      setSuccessMessage(response.message);
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
                disabled={isUploading}
                onUpload={(file) => handleUpload(document.type, file)}
              />

              {isUploading ? <p className="text-sm text-slate-500">Uploading {document.title}...</p> : null}

              {documents[document.type] ? (
                <DocumentPreviewCard
                  document={documents[document.type]}
                  previewUrl={previewUrls[documents[document.type].id]}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

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
