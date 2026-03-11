const STORAGE_KEY = "jatayu-onboarding";

const defaultState = {
  applicationId: null,
  started: false,
  status: null,
  completedSteps: {},
  formData: {},
};

let onboardingState = loadState();

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

function persistState() {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingState));
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
  onboardingState = {
    ...onboardingState,
    applicationId,
    started: true,
    status,
  };
  persistState();
}

export function syncApplication(application) {
  onboardingState = {
    ...onboardingState,
    applicationId: application.id,
    started: true,
    status: application.status,
    completedSteps: completedStepsFromApplication(application),
    formData: formDataFromApplication(application),
  };
  persistState();
}

export function isApplicationStarted() {
  return onboardingState.started && Boolean(onboardingState.applicationId);
}

export function isStepCompleted(stepKey) {
  return Boolean(onboardingState.completedSteps[stepKey]);
}

export function getApplicationId() {
  return onboardingState.applicationId;
}

export function getOnboardingStatus() {
  return onboardingState.status;
}

export function getOnboardingData() {
  return onboardingState.formData;
}
