import type { ReactNode } from "react";

/**
 * Container - primitiva de layout.
 *
 * Server Component. Wrappea secciones para imponer ancho maximo y gutter
 * horizontal responsive. No aporta fondo ni jerarquia, solo ritmo.
 *
 * Anchos (referenciados a tokens de `globals.css`):
 *   - default: 1200px (pagina completa, secciones principales)
 *   - narrow:  720px  (bloques de lectura, formularios)
 *
 * Gutter: 1.25rem mobile, 2rem desde `md` (768px).
 */

type ContainerSize = "default" | "narrow";

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
  "aria-label"?: string;
}

const WIDTH_MAP: Record<ContainerSize, string> = {
  default: "max-w-[1200px]",
  narrow: "max-w-[720px]",
};

export function Container({
  children,
  size = "default",
  className = "",
  "aria-label": ariaLabel,
}: ContainerProps) {
  const classes = [
    "mx-auto w-full px-5 md:px-8",
    WIDTH_MAP[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
