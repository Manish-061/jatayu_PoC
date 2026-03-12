import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import FormInput from "../components/FormInput";
import { startOnboardingRequest } from "../services/onboardingService";
import { setStartedCase } from "../store/onboardingStore";

const incomeOptions = ["< 3 Lakhs", "3-10 Lakhs", "10-25 Lakhs", "> 25 Lakhs"];

export default function OnboardingFormPage() {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
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
  });
  const navigate = useNavigate();

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
      <div className="space-y-2">
        <p className="section-kicker">Onboarding Application</p>
        <h2 className="text-3xl font-semibold text-slate-950">Complete account opening details</h2>
        <p className="text-sm leading-6 text-slate-500">
          Submit the full customer onboarding form first. Document upload follows in the next step.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Identity</h3>
        </div>
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
          <select {...register("gender", { required: "Gender is required." })} className="field-input">
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

        <div className="md:col-span-2 mt-2">
          <h3 className="text-lg font-semibold text-slate-900">Contact</h3>
        </div>
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

        <div className="md:col-span-2 mt-2">
          <h3 className="text-lg font-semibold text-slate-900">Address</h3>
        </div>
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

        <div className="md:col-span-2 mt-2">
          <h3 className="text-lg font-semibold text-slate-900">Verification</h3>
        </div>
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

        <div className="md:col-span-2 mt-2">
          <h3 className="text-lg font-semibold text-slate-900">Financial</h3>
        </div>
        <FormInput
          label="Occupation"
          name="occupation"
          register={register}
          rules={{ required: "Occupation is required." }}
          error={errors.occupation?.message}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Income Range</label>
          <select {...register("income_range", { required: "Income range is required." })} className="field-input">
            {incomeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 mt-2">
          <h3 className="text-lg font-semibold text-slate-900">Consent</h3>
        </div>
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

        {submitError ? <p className="text-sm text-rose-600 md:col-span-2">{submitError}</p> : null}

        <button className="btn-primary md:col-span-2" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Application..." : "Submit Onboarding Form"}
        </button>
      </form>
    </section>
  );
}
