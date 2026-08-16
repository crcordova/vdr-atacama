"use client";

import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";

/*
 * Header: institutional sticky header for VDR Atacama.
 *
 * This file is a Client Component because the mobile menu toggle owns
 * local open/closed state and a keydown handler (Escape to close). The
 * desktop nav, brand wordmark, and overall markup are static; marking
 * the whole file as a client component keeps the slice within a single
 * allowed file without sacrificing any interactivity.
 *
 * Layout cap (per design rules): 64px on mobile, 72px on desktop.
 * Sticky positioning, frosted backdrop, and a hairline border keep the
 * header present without competing with the hero.
 */

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: "#hero", label: "Inicio" },
  { href: "#video", label: "Video" },
  { href: "#acceso", label: "Acceso" },
];

function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative flex h-full items-center lg:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sky-300 transition-colors duration-base ease-standard hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900"
      >
        {open ? (
          <X size={22} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full border-b border-sky-300/15 bg-sky-900/95 backdrop-blur-md">
          <nav
            id={menuId}
            aria-label="Navegación principal"
            className="mx-auto max-w-content px-5 py-2 md:px-8"
          >
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md py-3 text-body font-medium text-sky-300 transition-colors duration-base ease-standard hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-sky-300/15 bg-sky-900/80 backdrop-blur-md lg:h-[72px]">
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-5 md:px-8">
        <a
          href="#hero"
          className="rounded-md font-sans text-cream font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900"
        >
          VDR Atacama
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md text-body font-medium text-sky-300 transition-colors duration-base ease-standard hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <MobileMenu items={NAV_ITEMS} />
      </div>
    </header>
  );
}