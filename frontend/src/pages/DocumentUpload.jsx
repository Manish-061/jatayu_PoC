import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UploadBox from "../components/UploadBox";
import StepProgressBar from "../components/StepProgressBar";
import { updateDocumentsRequest } from "../services/onboardingService";
import { getApplicationId, syncApplication } from "../store/onboardingStore";

export default function DocumentUpload() {
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    if (!file) {
      setError("Please upload a PAN or Aadhaar document to continue.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const application = await updateDocumentsRequest(getApplicationId(), {
        document_name: file.name,
      });
      syncApplication(application);
      navigate("/personal");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="content-panel space-y-8">
      <StepProgressBar step={1} />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">Upload identity proof</h2>
        <p className="text-sm leading-6 text-slate-500">
          Upload the customer&apos;s identity document before moving to personal details.
        </p>
      </div>

      <UploadBox onUpload={handleUpload} />
      {isUploading ? <p className="text-sm text-slate-500">Saving document...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </section>
  );
}
