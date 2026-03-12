function getPreviewKind(fileName) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "pdf") {
    return "pdf";
  }
  if (["png", "jpg", "jpeg"].includes(extension ?? "")) {
    return "image";
  }
  return "file";
}

export default function DocumentPreviewCard({ document, previewUrl }) {
  const previewKind = getPreviewKind(document.file_name);

  return (
    <article className="overflow-hidden rounded-[24px] border border-[rgba(15,23,42,0.08)] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            {document.type}
          </p>
          <h4 className="mt-1 text-base font-semibold text-slate-950">{document.file_name}</h4>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {document.status}
        </span>
      </div>

      <div className="bg-slate-50 p-4">
        {previewUrl ? (
          previewKind === "pdf" ? (
            <iframe
              src={previewUrl}
              title={document.file_name}
              className="h-72 w-full rounded-2xl border border-slate-200 bg-white"
            />
          ) : previewKind === "image" ? (
            <img
              src={previewUrl}
              alt={document.file_name}
              className="h-72 w-full rounded-2xl border border-slate-200 object-contain bg-white"
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
              Preview unavailable for this file type.
            </div>
          )
        ) : (
          <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
            Loading preview...
          </div>
        )}
      </div>

      {previewUrl ? (
        <div className="flex justify-end px-5 pb-5">
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Open document
          </a>
        </div>
      ) : null}
    </article>
  );
}
