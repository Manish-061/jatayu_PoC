import apiClient from "./apiClient";

function unwrapError(error) {
  return (
    error?.response?.data?.detail ??
    error?.message ??
    "Authentication request failed."
  );
}

export async function registerRequest(payload) {
  try {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function loginRequest(payload) {
  try {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getCurrentUserRequest() {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getRolesRequest() {
  try {
    const response = await apiClient.get("/auth/roles");
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}
