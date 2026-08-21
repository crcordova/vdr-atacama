import Image from "next/image";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

/**
 * Hero - primera seccion de la pagina.
 *
 * Server Component. Stack textual de cuatro elementos:
 *   1. Eyebrow categorico (11px uppercase, sky-300).
 *   2. Headline (H1) en dos lineas: marca + tagline.
 *   3. Subtext (parrafo, body, 14 palabras).
 *   4. CTA unico, anclado a la seccion de acceso.
 *
 * Imagen: decorativa (alt="" + aria-hidden). Se usa next/image con fill y
 * priority para reducir LCP y reservar espacio, evitando CLS.
 *
 * El CTA usa el componente <Button as="a" variant="primary"> para mantener
 * la semantica de ancla interna y reutilizar los estilos centralizados.
 */

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-dvh items-center overflow-hidden bg-sky-900 pt-24 pb-16 md:pb-24 scroll-mt-16 lg:scroll-mt-[72px]"
    >
      <Image
        src="/background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-linear-to-b from-sky-900/85 via-sky-900/60 to-sky-900/30"
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
            <Button
              as="a"
              href="#acceso"
              variant="primary"
              className="w-full sm:w-auto"
            >
              Acceder al Data Room
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
