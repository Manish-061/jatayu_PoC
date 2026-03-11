export default function UploadBox({ onUpload }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    onUpload(file);
  };

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-[rgba(0,119,182,0.25)] bg-[rgba(255,255,255,0.86)] px-6 py-10 text-center transition hover:border-[var(--color-primary)] hover:bg-[rgba(0,119,182,0.04)]">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(0,119,182,0.08)] text-2xl text-[var(--color-primary)]">
        ↑
      </span>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-slate-950">Upload PAN or Aadhaar</p>
        <p className="text-sm leading-6 text-slate-500">
          PDF, PNG, or JPG files up to 10 MB are accepted for verification.
        </p>
      </div>

      <span className="btn-secondary">Choose file</span>
      <input type="file" onChange={handleFile} className="hidden" />
    </label>
  );
}
