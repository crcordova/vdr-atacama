import { env } from "@/lib/env";
import { getSignedVideoUrl } from "@/lib/r2";
import { Container } from "../ui/Container";

/*
 * VideoSection - reproductor HTML5 nativo en 16:9 sobre fondo sky-900.
 *
 * Server Component: el elemento <video> se renderiza sin JavaScript del
 * cliente. La fuente es una URL firmada (presigned) de Cloudflare R2 con
 * validez de aproximadamente 4 horas, generada en tiempo de renderizado.
 * El navegador descarga el video directamente desde R2 en lugar de pasar
 * por el endpoint /api/video.
 *
 * Si la generacion de la URL firmada falla (por ejemplo, credenciales
 * mal configuradas), se muestra un placeholder para evitar que la pagina
 * falle por completo.
 *
 * Layout: Container size="narrow" (720px) para bloques de lectura.
 * Eyebrow omitido intencionalmente: Hero ya usa uno ("Portal de
 * inversionistas"); el limite es 1 eyebrow cada 3 secciones.
 *
 * Fondo: bg-sky-900 para mantener el page theme lock de la pagina.
 */

const VIDEO_TITLE = "Video de presentación del proyecto VDR Atacama";

export async function VideoSection() {
  let videoUrl: string | null = null;

  try {
    videoUrl = await getSignedVideoUrl(env.VIDEO_R2_KEY);
  } catch {
    // Fall through to render the placeholder fallback UI.
    videoUrl = null;
  }

  return (
    <section
      id="video"
      aria-labelledby="video-heading"
      className="bg-sky-900 py-20 md:py-28 scroll-mt-16 lg:scroll-mt-18"
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
        <div
          className="relative w-full"
          style={{ paddingTop: "56.25%" }}
        >
          {videoUrl ? (
            <video
              className="absolute inset-0 h-full w-full rounded-md border border-sky-300/20"
              src={videoUrl}
              controls
              preload="metadata"
              playsInline
              title={VIDEO_TITLE}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-md border border-sky-300/20 bg-sky-950/50">
              <p className="text-body text-cream/70">
                Video no disponible en este momento.
              </p>
            </div>
          )}
        </div>
      </Container>
      <hr className="section-divider" />
    </section>
  );
}
