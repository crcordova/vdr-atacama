import { Container } from "../ui/Container";
import { env } from "@/lib/env";

/*
 * VideoSection - iframe YouTube responsivo en 16:9 sobre fondo sky-900.
 *
 * Server Component: el iframe puede renderizarse sin JS del cliente y se
 * carga de forma perezosa con loading="lazy". El origen del video proviene
 * de NEXT_PUBLIC_VIDEO_URL (validado en lib/env.ts al boot). Si la
 * variable no estuviera presente, se usa un placeholder publico como red
 * de seguridad para que la seccion nunca quede vacia en desarrollo.
 *
 * Layout: Container size="narrow" (720px) para bloques de lectura.
 * Eyebrow omitido intencionalmente: Hero ya usa uno ("Portal de
 * inversionistas"); el limite es 1 eyebrow cada 3 secciones.
 *
 * Fondo: bg-sky-900 para mantener el page theme lock de la pagina.
 */

const VIDEO_TITLE = "Video de presentación del proyecto VDR Atacama";
const FALLBACK_VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";
const FALLBACK_PLACEHOLDER_TEXT = "Video pendiente de carga";

export function VideoSection() {
  const videoUrl = env.NEXT_PUBLIC_VIDEO_URL ?? FALLBACK_VIDEO_URL;

  return (
    <section
      id="video"
      aria-labelledby="video-heading"
      className="bg-sky-900 py-20 md:py-28 scroll-mt-16 lg:scroll-mt-[72px]"
    >
      <Container size="narrow">
        <h2
          id="video-heading"
          className="mb-4 text-h2 text-cream"
        >
          Video del proyecto
        </h2>
        <p className="mb-8 max-w-[65ch] text-body text-cream/85">
          Un resumen audiovisual del proyecto y su propuesta de valor.
        </p>
        {videoUrl ? (
          <div
            className="relative w-full"
            style={{ paddingTop: "56.25%" }}
          >
            <iframe
              className="absolute inset-0 h-full w-full rounded-md border border-sky-300/20"
              src={videoUrl}
              loading="lazy"
              title={VIDEO_TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-md border border-sky-300/20 bg-sky-700 text-cream/60">
            {FALLBACK_PLACEHOLDER_TEXT}
          </div>
        )}
      </Container>
      <hr className="section-divider" />
    </section>
  );
}
