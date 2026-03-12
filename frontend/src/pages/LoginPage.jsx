import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitError("");

    try {
      await login(data);
      navigate(location.state?.from?.pathname ?? "/status", { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="content-panel space-y-6">
        <div className="space-y-2 text-center">
          <p className="section-kicker">Sign In</p>
          {/* <h2 className="text-3xl font-semibold text-slate-950">Access the onboarding portal</h2> */}
          <p className="text-sm leading-6 text-slate-500">
            Login with your registered email and password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormInput
            label="Email Address"
            name="email"
            register={register}
            type="email"
            rules={{ required: "Email is required." }}
            error={errors.email?.message}
          />

          <FormInput
            label="Password"
            name="password"
            register={register}
            type="password"
            rules={{ required: "Password is required." }}
            error={errors.password?.message}
          />

          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

          <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-[var(--color-primary)]">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
