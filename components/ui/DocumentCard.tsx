import { Download, FileText } from "lucide-react";

/**
 * DocumentCard - visual unit for a single PDF in the data room.
 *
 * Server Component. No client state, no interactivity beyond the native
 * download link. The href routes to /api/download/[id], which performs the
 * cookie check and proxies the R2 stream (see slice 5.2).
 *
 * Layout: icon + title (top row), description, filename in mono, then a
 * download link styled as a primary CTA. The link is an <a> element with a
 * `download` attribute so the browser honors `filename` on save.
 */

type DocumentCardProps = {
  id: string;
  title: string;
  description: string;
  filename: string;
};

export function DocumentCard({
  id,
  title,
  description,
  filename,
}: DocumentCardProps) {
  return (
    <article className="bg-sky-700 border border-sky-300/15 rounded-md p-6 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <FileText
          className="w-6 h-6 text-desert-300 shrink-0 mt-1"
          aria-hidden="true"
          strokeWidth={1.5}
        />
        <h3 className="text-h3 text-cream leading-tight">{title}</h3>
      </div>

      <p className="text-sm text-cream/70 leading-relaxed">{description}</p>

      <p className="text-xs font-mono text-sky-300/80 break-all">{filename}</p>

      <a
        href={`/api/download/${id}`}
        download={filename}
        aria-label={`Descargar ${title}`}
        className="mt-2 inline-flex items-center justify-center gap-2 bg-desert-700 text-cream font-medium px-4 py-2 rounded-md hover:bg-desert-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-700 active:scale-[0.98]"
      >
        <Download className="w-4 h-4" aria-hidden="true" strokeWidth={1.5} />
        Descargar PDF
      </a>
    </article>
  );
}