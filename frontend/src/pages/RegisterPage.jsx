import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import FormInput from "../components/FormInput";
import { getRolesRequest, registerRequest } from "../services/authService";

export default function RegisterPage() {
  const [submitError, setSubmitError] = useState("");
  const [roles, setRoles] = useState([]);
  const [rolesError, setRolesError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "customer",
    },
  });
  const navigate = useNavigate();
  const selectedRole = watch("role", "customer");

  useEffect(() => {
    async function loadRoles() {
      try {
        const response = await getRolesRequest();
        setRoles(response);
      } catch (error) {
        setRolesError(error.message);
      }
    }

    loadRoles();
  }, []);

  const onSubmit = async (data) => {
    setSubmitError("");

    try {
      await registerRequest(data);
      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <section className="mx-auto max-w-xl">
      <div className="content-panel space-y-6">
        <div className="space-y-2 text-center">
          <p className="section-kicker">Create Account</p>
          <h2 className="text-3xl font-semibold text-slate-950">Register for the portal</h2>
          <p className="text-sm leading-6 text-slate-500">
            Create a customer account to start and track onboarding.
          </p>
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

          <div className="md:col-span-2">
            <FormInput
              label="Password"
              name="password"
              register={register}
              type="password"
              rules={{
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
              }}
              error={errors.password?.message}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              {...register("role", { required: "Role is required." })}
              className={`field-input ${errors.role ? "field-input-error" : ""}`}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role ? <p className="text-sm text-rose-600">{errors.role.message}</p> : null}
            {roles.length > 0 ? (
              <p className="text-sm leading-6 text-slate-500">
                {roles.find((role) => role.value === selectedRole)?.description}
              </p>
            ) : null}
            {rolesError ? <p className="text-sm text-rose-600">{rolesError}</p> : null}
          </div>

          {submitError ? <p className="text-sm text-rose-600 md:col-span-2">{submitError}</p> : null}

          <button className="btn-primary md:col-span-2" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-[var(--color-primary)]">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
