import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

function unwrapError(error) {
  return (
    error?.response?.data?.detail ??
    error?.message ??
    "Something went wrong while saving the application."
  );
}

export async function startApplicationRequest() {
  try {
    const response = await api.post("/onboarding");
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getApplicationRequest(applicationId) {
  try {
    const response = await api.get(`/onboarding/${applicationId}`);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function updateMobileRequest(applicationId, payload) {
  try {
    const response = await api.patch(`/onboarding/${applicationId}/mobile`, payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function updateDocumentsRequest(applicationId, payload) {
  try {
    const response = await api.patch(`/onboarding/${applicationId}/documents`, payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function updatePersonalRequest(applicationId, payload) {
  try {
    const response = await api.patch(`/onboarding/${applicationId}/personal`, payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function updateAddressRequest(applicationId, payload) {
  try {
    const response = await api.patch(`/onboarding/${applicationId}/address`, payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function updateFinancialRequest(applicationId, payload) {
  try {
    const response = await api.patch(`/onboarding/${applicationId}/financial`, payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function updateConsentRequest(applicationId, payload) {
  try {
    const response = await api.patch(`/onboarding/${applicationId}/consent`, payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}
