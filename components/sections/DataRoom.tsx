import { Container } from "@/components/ui/Container";
import { DocumentCard } from "@/components/ui/DocumentCard";
import {
  CATALOG,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type DocumentCategory,
} from "@/lib/catalog";

/**
 * DataRoom - authenticated section listing every PDF in the catalog.
 *
 * Server Component. Visibility is gated upstream by app/page.tsx (cookie check),
 * so this component assumes the viewer is already authenticated.
 *
 * Structure: one heading + subtext at the top, then a sub-block per category
 * (gestion-soberana with 4 docs, inversores with 3 docs). Each sub-block holds
 * a 2-column grid of DocumentCards on desktop, collapsing to a single column
 * below the md breakpoint (768px).
 *
 * Background stays on bg-sky-900 to honor the page theme lock; cards elevate
 * to bg-sky-700 inside the section without flipping the global theme.
 */

export function DataRoom() {
  return (
    <section
      id="data-room"
      aria-labelledby="data-room-heading"
      className="bg-sky-900 py-20 md:py-28"
    >
      <Container>
        <header className="max-w-[720px]">
          <h2
            id="data-room-heading"
            className="text-h2 text-cream leading-tight"
          >
            Documentos del proyecto
          </h2>
          <p className="mt-4 text-base text-cream/70 leading-relaxed">
            Siete documentos clasificados en dos areas. Descarga segura bajo
            autenticacion.
          </p>
        </header>

        {CATEGORY_ORDER.map((category: DocumentCategory, index) => {
          const docs = CATALOG.filter((doc) => doc.category === category);
          return (
            <div
              key={category}
              className={index === 0 ? "mt-12" : "mt-8"}
            >
              <h3 className="text-h3 text-cream/90">{CATEGORY_LABELS[category]}</h3>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {docs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    description={doc.description}
                    filename={doc.filename}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}