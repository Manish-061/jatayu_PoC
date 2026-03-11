import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import StepProgressBar from "../components/StepProgressBar";
import FormInput from "../components/FormInput";
import { updateAddressRequest } from "../services/onboardingService";
import { getApplicationId, syncApplication } from "../store/onboardingStore";

export default function AddressDetails() {
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
      const application = await updateAddressRequest(getApplicationId(), data);
      syncApplication(application);
      navigate("/financial");
    } catch (requestError) {
      setSubmitError(requestError.message);
    }
  };

  return (
    <section className="content-panel space-y-8">
      <StepProgressBar step={3} />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">Address details</h2>
        <p className="text-sm leading-6 text-slate-500">
          Enter the applicant&apos;s current residential address to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <FormInput
            label="Address"
            name="address"
            register={register}
            placeholder="House number, street, locality"
            rules={{ required: "Address is required." }}
            error={errors.address?.message}
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

        {submitError ? <p className="text-sm text-rose-600 md:col-span-2">{submitError}</p> : null}

        <button className="btn-primary md:col-span-2" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </form>
    </section>
  );
}
