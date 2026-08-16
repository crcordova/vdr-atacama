import { Container } from "../ui/Container";

/**
 * Hero - primera seccion de la pagina.
 *
 * Server Component. Stack textual de cuatro elementos:
 *   1. Eyebrow categorico (11px uppercase, sky-300).
 *   2. Headline (H1) en dos lineas: marca + tagline.
 *   3. Subtext (parrafo, body, 14 palabras).
 *   4. CTA unico, anclado a la seccion de acceso.
 *
 * Imagen: decorativa (alt="" + aria-hidden). Carga prioritaria alta (LCP).
 * Se usa <img> en lugar de next/image para no introducir optimizacion
 * fuera de alcance de este slice; cuando se quiera priorizar LCP o
 * generacion responsive, migrar a next/image con priority + fill.
 *
 * El CTA es un <a> estilizado como boton primario. Sera reemplazado por
 * <Button variant="primary"> en slice 4.2.
 */

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-sky-900 pt-24 pb-16 md:pb-24"
    >
      <img
        src="/background.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-b from-sky-900/85 via-sky-900/60 to-sky-900/30"
      />
      <Container className="relative z-20">
        <div className="max-w-[65ch]">
          <p className="mb-6 text-[11px] uppercase tracking-[0.18em] text-sky-300">
            Portal de inversionistas
          </p>
          <h1
            id="hero-heading"
            className="text-h1 text-cream md:text-display"
          >
            <span className="block font-medium">VDR Atacama</span>
            <span className="mt-3 block text-h3 font-light text-cream/90 text-balance md:mt-6 md:text-h2">
              Documentos reservados para inversionistas del proyecto.
            </span>
          </h1>
          <p className="mt-6 max-w-[65ch] text-body text-cream/85 md:mt-8">
            Acceso verificado para inversores calificados. Documentacion
            tecnica, legal y financiera, bajo acuerdo de confidencialidad.
          </p>
          <div className="mt-8 md:mt-10">
            {/* Replace with <Button variant="primary"> in slice 4.2 */}
            <a
              href="#acceso"
              className="inline-flex items-center justify-center rounded-md bg-desert-700 px-6 py-3 font-medium text-cream transition-colors hover:bg-desert-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900"
            >
              Acceder al Data Room
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
