import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import StepProgressBar from "../components/StepProgressBar";
import FormInput from "../components/FormInput";
import { updateMobileRequest } from "../services/onboardingService";
import { getApplicationId, syncApplication } from "../store/onboardingStore";

export default function MobileVerification() {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitError("");

    try {
      const application = await updateMobileRequest(getApplicationId(), data);
      syncApplication(application);
      navigate("/upload-doc");
    } catch (requestError) {
      setSubmitError(requestError.message);
    }
  };

  return (
    <section className="content-panel space-y-8">
      <StepProgressBar step={0} />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">Mobile verification</h2>
        <p className="text-sm leading-6 text-slate-500">
          Enter the applicant&apos;s primary mobile number to begin the onboarding flow.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Mobile Number"
          name="mobile"
          register={register}
          placeholder="Enter 10-digit mobile number"
          rules={{
            required: "Mobile number is required.",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit mobile number.",
            },
          }}
          error={errors.mobile?.message}
        />

        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </section>
  );
}
