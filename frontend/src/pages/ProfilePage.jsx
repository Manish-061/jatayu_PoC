import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      full_name: user.full_name,
      email: user.email,
      mobile_number: user.mobile_number,
    });
  }, [reset, user]);

  const onSubmit = async (data) => {
    setSubmitError("");
    setSuccessMessage("");

    try {
      await updateProfile(data);
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <section className="mx-auto max-w-3xl">
      <div className="content-panel space-y-6">
        <div className="space-y-2">
          <p className="section-kicker">Profile Settings</p>
          <h2 className="text-3xl font-semibold text-slate-950">Manage your account details</h2>
          <p className="text-sm leading-6 text-slate-500">
            Update the core profile details used across the onboarding portal.
          </p>
        </div>

        <div className="rounded-[28px] border border-[rgba(15,23,42,0.08)] bg-white/90 p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Signed-in role</p>
              <p className="text-lg font-semibold capitalize text-slate-950">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
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
              label="Email Address"
              name="email"
              register={register}
              type="email"
              rules={{ required: "Email is required." }}
              error={errors.email?.message}
            />

            <FormInput
              label="Mobile Number"
              name="mobile_number"
              register={register}
              rules={{
                required: "Mobile number is required.",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit mobile number.",
                },
              }}
              error={errors.mobile_number?.message}
            />

            {submitError ? <p className="text-sm text-rose-600 md:col-span-2">{submitError}</p> : null}
            {successMessage ? <p className="text-sm text-emerald-700 md:col-span-2">{successMessage}</p> : null}

            <button className="btn-primary md:col-span-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving Changes..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
