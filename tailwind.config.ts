import type { Config } from "tailwindcss";

/*
 * Tailwind config for VDR Atacama.
 *
 * Color tokens are declared in app/globals.css via @theme (Tailwind v4
 * canonical source). This file mirrors those mappings to var(--...) so the
 * project stays portable if any tooling reads theme.extend.colors directly.
 *
 * Do not hardcode hex values here. Always reference the CSS variables defined
 * in globals.css.
 */

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "sky-900": "var(--color-sky-900)",
        "sky-700": "var(--color-sky-700)",
        "sky-300": "var(--color-sky-300)",
        cream: "var(--color-cream)",
        "gold-700": "var(--color-gold-700)",
        "gold-500": "var(--color-gold-500)",
        "gold-300": "var(--color-gold-300)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      maxWidth: {
        content: "var(--container-content)",
        narrow: "var(--container-narrow)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "240ms",
        slow: "360ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.16, 1, 0.3, 1)",
        soft: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
};

export default config;