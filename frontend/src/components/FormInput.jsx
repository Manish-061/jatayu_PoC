export default function FormInput({
  label,
  register,
  name,
  type = "text",
  placeholder,
  rules,
  error,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        {...register(name, rules)}
        type={type}
        placeholder={placeholder ?? label}
        className={`field-input ${error ? "field-input-error" : ""}`}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
