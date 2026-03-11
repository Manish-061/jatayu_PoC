import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import StepProgressBar from "../components/StepProgressBar";
import FormInput from "../components/FormInput";
import { updateFinancialRequest } from "../services/onboardingService";
import { getApplicationId, syncApplication } from "../store/onboardingStore";

export default function FinancialDetails() {
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
      const application = await updateFinancialRequest(getApplicationId(), data);
      syncApplication(application);
      navigate("/consent");
    } catch (requestError) {
      setSubmitError(requestError.message);
    }
  };

  return (
    <section className="content-panel space-y-8">
      <StepProgressBar step={4} />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">Financial details</h2>
        <p className="text-sm leading-6 text-slate-500">
          Capture occupation and income information before consent is recorded.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <FormInput
          label="Occupation"
          name="occupation"
          register={register}
          placeholder="Salaried, self-employed, student"
          rules={{ required: "Occupation is required." }}
          error={errors.occupation?.message}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Income Range</label>
          <select
            {...register("income_range", { required: "Income range is required." })}
            className={`field-input ${errors.income_range ? "field-input-error" : ""}`}
            defaultValue=""
          >
            <option value="" disabled>
              Select income range
            </option>
            <option value="under-3">&lt; 3 Lakhs</option>
            <option value="3-10">3-10 Lakhs</option>
            <option value="10-25">10-25 Lakhs</option>
            <option value="25-plus">25+ Lakhs</option>
          </select>
          {errors.income_range ? (
            <p className="text-sm text-rose-600">{errors.income_range.message}</p>
          ) : null}
        </div>

        {submitError ? <p className="text-sm text-rose-600 md:col-span-2">{submitError}</p> : null}

        <button className="btn-primary md:col-span-2" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </section>
  );
}
