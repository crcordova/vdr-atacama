import { Download, FileText } from "lucide-react";
import { Button } from "./Button";

/**
 * DocumentCard - visual unit for a single PDF in the data room.
 *
 * Server Component. No client state, no interactivity beyond the native
 * download link. The href routes to /api/download/[id], which performs the
 * cookie check and proxies the R2 stream (see slice 5.2).
 *
 * Layout: icon + title (top row), description, filename in mono, then a
 * download link styled as a primary CTA using the shared Button component.
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
          className="w-6 h-6 text-gold-300 shrink-0 mt-1"
          aria-hidden="true"
          strokeWidth={1.5}
        />
        <h3 className="text-h3 text-cream leading-tight">{title}</h3>
      </div>

      <p className="text-sm text-cream/70 leading-relaxed">{description}</p>

      <p className="text-xs font-mono text-sky-300/80 break-all">{filename}</p>

      <Button
        as="a"
        href={`/api/download/${id}`}
        download={filename}
        aria-label={`Descargar ${title}`}
        variant="primary"
        className="mt-2 gap-2 px-4 py-2"
      >
        <Download className="w-4 h-4" aria-hidden="true" strokeWidth={1.5} />
        Descargar PDF
      </Button>
    </article>
  );
}
