import apiClient from "./apiClient";

function unwrapError(error) {
  return (
    error?.response?.data?.detail ??
    error?.message ??
    "Onboarding request failed."
  );
}

export async function startOnboardingRequest(payload) {
  try {
    const response = await apiClient.post("/onboarding/start", payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function uploadDocumentRequest({ caseId, documentType, file }) {
  try {
    const formData = new FormData();
    formData.append("case_id", caseId);
    formData.append("document_type", documentType);
    formData.append("file", file);

    const response = await apiClient.post("/onboarding/upload-document", formData);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getOnboardingStatusRequest(caseId) {
  try {
    const response = await apiClient.get(`/onboarding/status/${caseId}`);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}
