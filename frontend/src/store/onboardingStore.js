const STORAGE_KEY = "jatayu-onboarding";

const defaultState = {
  caseId: null,
  status: null,
  detailsSubmitted: false,
  uploadedDocuments: {},
};

function loadState() {
  if (typeof window === "undefined") {
    return { ...defaultState };
  }

  const rawState = window.sessionStorage.getItem(STORAGE_KEY);
  if (!rawState) {
    return { ...defaultState };
  }

  try {
    return { ...defaultState, ...JSON.parse(rawState) };
  } catch {
    return { ...defaultState };
  }
}

function persistState(nextState) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }
}

export function setStartedCase(caseId, status) {
  const nextState = {
    ...loadState(),
    caseId,
    status,
    detailsSubmitted: true,
  };
  persistState(nextState);
  return nextState;
}

export function markDocumentUploaded(documentType) {
  const currentState = loadState();
  const nextState = {
    ...currentState,
    uploadedDocuments: {
      ...currentState.uploadedDocuments,
      [documentType]: true,
    },
  };
  persistState(nextState);
  return nextState;
}

export function syncStatus(statusPayload) {
  const nextState = {
    ...loadState(),
    caseId: statusPayload.case_id,
    status: statusPayload.status,
    detailsSubmitted: true,
    uploadedDocuments: Object.fromEntries(
      statusPayload.documents.map((document) => [document.type, true])
    ),
  };
  persistState(nextState);
  return nextState;
}

export function getCaseId() {
  return loadState().caseId;
}

export function hasStartedCase() {
  return Boolean(loadState().caseId);
}

export function hasSubmittedDetails() {
  return loadState().detailsSubmitted;
}

export function hasUploadedRequiredDocuments() {
  const uploaded = loadState().uploadedDocuments;
  return Boolean(uploaded.PAN && uploaded.AADHAAR);
}

export function getUploadedDocuments() {
  return loadState().uploadedDocuments;
}
