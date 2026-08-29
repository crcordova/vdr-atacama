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
 * (inversores first with 5 docs, gestion-soberana second with 4 docs). Each
 * sub-block holds a 2-column grid of DocumentCards on desktop, collapsing to
 * a single column below the md breakpoint (768px).
 *
 * Odd-count handling: when a category has an odd number of documents, the
 * final card spans both columns (md) via a :nth-child(odd):last-child
 * selector, so a 5-doc grid closes with a deliberate full-width card instead
 * of an orphan. This is data-driven and applies to any odd count.
 *
 * Background stays on bg-sky-900 to honor the page theme lock; cards elevate
 * to bg-sky-700 inside the section without flipping the global theme.
 */

export function DataRoom() {
  return (
    <section
      id="data-room"
      aria-labelledby="data-room-heading"
      className="bg-sky-900 py-20 md:py-28 scroll-mt-16 lg:scroll-mt-18"
    >
      <Container>
        <header className="max-w-180">
          <h2
            id="data-room-heading"
            className="text-h2 text-cream leading-tight"
          >
            Documentos del proyecto
          </h2>
          <p className="mt-4 text-base text-cream/70 leading-relaxed">
            Nueve documentos clasificados en dos areas. Descarga segura bajo
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
              {/* On md, an odd-count grid closes with a deliberate
                  full-width last card instead of an orphan column. */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:[&>*:last-child:nth-child(odd)]:col-span-2">
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