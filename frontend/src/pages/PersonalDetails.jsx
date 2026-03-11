import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import StepProgressBar from "../components/StepProgressBar";
import FormInput from "../components/FormInput";
import { updatePersonalRequest } from "../services/onboardingService";
import { getApplicationId, syncApplication } from "../store/onboardingStore";

export default function PersonalDetails() {
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
      const application = await updatePersonalRequest(getApplicationId(), data);
      syncApplication(application);
      navigate("/address");
    } catch (requestError) {
      setSubmitError(requestError.message);
    }
  };

  return (
    <section className="content-panel space-y-8">
      <StepProgressBar step={2} />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">Personal details</h2>
        <p className="text-sm leading-6 text-slate-500">
          Capture the applicant&apos;s basic profile exactly as it appears on the
          supporting documents.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <FormInput
          label="Full Name"
          name="full_name"
          register={register}
          placeholder="Applicant full name"
          rules={{ required: "Full name is required." }}
          error={errors.full_name?.message}
        />

        <FormInput
          label="Date of Birth"
          name="dob"
          register={register}
          type="date"
          rules={{ required: "Date of birth is required." }}
          error={errors.dob?.message}
        />

        {submitError ? <p className="text-sm text-rose-600 md:col-span-2">{submitError}</p> : null}

        <button className="btn-primary md:col-span-2" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </section>
  );
}
