import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import FormInput from "../components/FormInput";
import { startOnboardingRequest } from "../services/onboardingService";
import { setStartedCase } from "../store/onboardingStore";

const incomeOptions = ["< 3 Lakhs", "3-10 Lakhs", "10-25 Lakhs", "> 25 Lakhs"];

const steps = [
  {
    title: "Identity",
    description: "Capture the core personal details as they appear on government records.",
    fields: ["full_name", "date_of_birth", "gender", "nationality"],
  },
  {
    title: "Contact",
    description: "Add the primary email address and mobile number for communication.",
    fields: ["email", "phone"],
  },
  {
    title: "Address",
    description: "Capture the current residential address for compliance checks.",
    fields: ["address_line", "city", "state", "postal_code", "country"],
  },
  {
    title: "Verification",
    description: "Record the PAN and Aadhaar numbers to match against uploaded documents.",
    fields: ["pan_number", "aadhaar_number"],
  },
  {
    title: "Financial",
    description: "Capture minimal occupation and income information for onboarding.",
    fields: ["occupation", "income_range"],
  },
  {
    title: "Consent",
    description: "Collect the final declarations required to submit the application.",
    fields: ["terms_accepted", "kyc_consent"],
  },
];

export default function OnboardingFormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      gender: "Male",
      nationality: "Indian",
      country: "India",
      income_range: "10-25 Lakhs",
      terms_accepted: false,
      kyc_consent: false,
    },
    mode: "onTouched",
  });
  const navigate = useNavigate();

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  async function handleNext() {
    const isValid = await trigger(step.fields);
    if (isValid) {
      setCurrentStep((value) => value + 1);
    }
  }

  function handleBack() {
    setCurrentStep((value) => Math.max(0, value - 1));
  }

  const onSubmit = async (data) => {
    setSubmitError("");

    const payload = {
      personal_details: {
        full_name: data.full_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        nationality: data.nationality,
      },
      contact_details: {
        email: data.email,
        phone: data.phone,
      },
      address_details: {
        address_line: data.address_line,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
      },
      identity_details: {
        pan_number: data.pan_number.toUpperCase(),
        aadhaar_number: data.aadhaar_number,
      },
      financial_details: {
        occupation: data.occupation,
        income_range: data.income_range,
      },
      consent: {
        terms_accepted: data.terms_accepted,
        kyc_consent: data.kyc_consent,
      },
    };

    try {
      const response = await startOnboardingRequest(payload);
      setStartedCase(response.case_id, response.status);
      navigate("/documents");
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <section className="content-panel space-y-8">
      <div className="space-y-3">
        <p className="section-kicker">Onboarding Application</p>
        <h2 className="text-3xl font-semibold text-slate-950">Complete account opening details</h2>
        <p className="text-sm leading-6 text-slate-500">
          Fill the customer information in guided steps and submit the full onboarding form at the end.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-6">
        {steps.map((item, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <div
              key={item.title}
              className={`rounded-2xl border px-4 py-3 text-sm ${
                isActive
                  ? "border-[var(--color-primary)] bg-[rgba(0,119,182,0.08)] text-slate-950"
                  : isComplete
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-medium">{item.title}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[28px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-slate-950">{step.title}</h3>
          <p className="text-sm leading-6 text-slate-500">{step.description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5 md:grid-cols-2">
          {currentStep === 0 ? (
            <>
              <div className="md:col-span-2">
                <FormInput
                  label="Full Name"
                  name="full_name"
                  register={register}
                  rules={{ required: "Full name is required." }}
                  error={errors.full_name?.message}
                />
              </div>
              <FormInput
                label="Date of Birth"
                name="date_of_birth"
                register={register}
                type="date"
                rules={{ required: "Date of birth is required." }}
                error={errors.date_of_birth?.message}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select
                  {...register("gender", { required: "Gender is required." })}
                  className="field-input"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <FormInput
                label="Nationality"
                name="nationality"
                register={register}
                rules={{ required: "Nationality is required." }}
                error={errors.nationality?.message}
              />
            </>
          ) : null}

          {currentStep === 1 ? (
            <>
              <FormInput
                label="Email Address"
                name="email"
                register={register}
                type="email"
                rules={{ required: "Email is required." }}
                error={errors.email?.message}
              />
              <FormInput
                label="Phone Number"
                name="phone"
                register={register}
                rules={{
                  required: "Phone number is required.",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number.",
                  },
                }}
                error={errors.phone?.message}
              />
            </>
          ) : null}

          {currentStep === 2 ? (
            <>
              <div className="md:col-span-2">
                <FormInput
                  label="Address Line"
                  name="address_line"
                  register={register}
                  rules={{ required: "Address line is required." }}
                  error={errors.address_line?.message}
                />
              </div>
              <FormInput
                label="City"
                name="city"
                register={register}
                rules={{ required: "City is required." }}
                error={errors.city?.message}
              />
              <FormInput
                label="State"
                name="state"
                register={register}
                rules={{ required: "State is required." }}
                error={errors.state?.message}
              />
              <FormInput
                label="Postal Code"
                name="postal_code"
                register={register}
                rules={{
                  required: "Postal code is required.",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Enter a valid 6-digit postal code.",
                  },
                }}
                error={errors.postal_code?.message}
              />
              <FormInput
                label="Country"
                name="country"
                register={register}
                rules={{ required: "Country is required." }}
                error={errors.country?.message}
              />
            </>
          ) : null}

          {currentStep === 3 ? (
            <>
              <FormInput
                label="PAN Number"
                name="pan_number"
                register={register}
                rules={{
                  required: "PAN number is required.",
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i,
                    message: "Enter a valid PAN number.",
                  },
                }}
                error={errors.pan_number?.message}
              />
              <FormInput
                label="Aadhaar Number"
                name="aadhaar_number"
                register={register}
                rules={{
                  required: "Aadhaar number is required.",
                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: "Enter a valid 12-digit Aadhaar number.",
                  },
                }}
                error={errors.aadhaar_number?.message}
              />
            </>
          ) : null}

          {currentStep === 4 ? (
            <>
              <FormInput
                label="Occupation"
                name="occupation"
                register={register}
                rules={{ required: "Occupation is required." }}
                error={errors.occupation?.message}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Income Range</label>
                <select
                  {...register("income_range", { required: "Income range is required." })}
                  className="field-input"
                >
                  {incomeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}

          {currentStep === 5 ? (
            <>
              <label className="consent-item md:col-span-2">
                <input
                  type="checkbox"
                  {...register("terms_accepted", {
                    required: "Terms acceptance is required.",
                  })}
                  className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
                />
                <span>I accept the terms and conditions for opening this account.</span>
              </label>
              {errors.terms_accepted ? (
                <p className="text-sm text-rose-600 md:col-span-2">{errors.terms_accepted.message}</p>
              ) : null}

              <label className="consent-item md:col-span-2">
                <input
                  type="checkbox"
                  {...register("kyc_consent", {
                    required: "KYC consent is required.",
                  })}
                  className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
                />
                <span>I consent to identity verification and onboarding checks.</span>
              </label>
              {errors.kyc_consent ? (
                <p className="text-sm text-rose-600 md:col-span-2">{errors.kyc_consent.message}</p>
              ) : null}
            </>
          ) : null}

          {submitError ? <p className="text-sm text-rose-600 md:col-span-2">{submitError}</p> : null}

          <div className="mt-2 flex items-center justify-between gap-3 md:col-span-2">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              disabled={currentStep === 0 || isSubmitting}
            >
              Back
            </button>

            {isLastStep ? (
              <button className="btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating Application..." : "Submit Onboarding Form"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
                disabled={isSubmitting}
              >
                Continue
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
