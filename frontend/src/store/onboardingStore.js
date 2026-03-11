const STORAGE_KEY = "jatayu-onboarding";

const defaultState = {
  applicationId: null,
  started: false,
  status: null,
  completedSteps: {},
  formData: {},
};

function loadState() {
  if (typeof window === "undefined") {
    return { ...defaultState };
  }

  const storedState = window.sessionStorage.getItem(STORAGE_KEY);
  if (!storedState) {
    return { ...defaultState };
  }

  try {
    return { ...defaultState, ...JSON.parse(storedState) };
  } catch {
    return { ...defaultState };
  }
}

function persistState(nextState) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }
}

function completedStepsFromApplication(application) {
  return {
    mobile: Boolean(application.mobile),
    documents: Boolean(application.document_name),
    personal: Boolean(application.full_name && application.dob),
    address: Boolean(
      application.address &&
        application.city &&
        application.state &&
        application.postal_code
    ),
    financial: Boolean(application.occupation && application.income_range),
    consent: Boolean(application.terms_accepted && application.verification_allowed),
  };
}

function formDataFromApplication(application) {
  return {
    mobile: application.mobile ?? "",
    document_name: application.document_name ?? "",
    full_name: application.full_name ?? "",
    dob: application.dob ?? "",
    address: application.address ?? "",
    city: application.city ?? "",
    state: application.state ?? "",
    postal_code: application.postal_code ?? "",
    occupation: application.occupation ?? "",
    income_range: application.income_range ?? "",
    terms_accepted: application.terms_accepted ?? false,
    verification_allowed: application.verification_allowed ?? false,
  };
}

export function setStartedApplication(applicationId, status) {
  const currentState = loadState();
  const nextState = {
    ...currentState,
    applicationId,
    started: true,
    status,
  };

  persistState(nextState);
  return nextState;
}

export function syncApplication(application) {
  const currentState = loadState();
  const nextState = {
    ...currentState,
    applicationId: application.id,
    started: true,
    status: application.status,
    completedSteps: completedStepsFromApplication(application),
    formData: formDataFromApplication(application),
  };

  persistState(nextState);
  return nextState;
}

export function getOnboardingState() {
  return loadState();
}

export function isApplicationStarted() {
  const state = loadState();
  return state.started && Boolean(state.applicationId);
}

export function isStepCompleted(stepKey) {
  return Boolean(loadState().completedSteps[stepKey]);
}

export function getApplicationId() {
  return loadState().applicationId;
}

export function getOnboardingStatus() {
  return loadState().status;
}

export function getOnboardingData() {
  return loadState().formData;
}
