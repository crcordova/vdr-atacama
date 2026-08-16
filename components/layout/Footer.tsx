/*
 * Footer: institutional footer for VDR Atacama.
 *
 * Server Component. Single horizontal rule on desktop, stacks on mobile.
 * No version stamps, no locale strips, no scroll cues (per design rules).
 */
export function Footer() {
  return (
    <footer className="border-t border-sky-300/15 bg-sky-900">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-6 text-small text-sky-300 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-6">
        <p>VDR Atacama · Portal de inversionistas</p>
        <p>Documentos reservados · Acceso restringido</p>
      </div>
    </footer>
  );
}