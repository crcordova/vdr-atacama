"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Container } from "@/components/ui/Container";

type AccessState = {
  status: "idle" | "loading" | "error" | "success";
  message?: string;
};

const DATA_ROOM_ID = "data-room";
const DATA_ROOM_HEADING_ID = "data-room-heading";
const SUCCESS_MESSAGE = "Acceso concedido. Cargando documentos...";
const SCROLL_ATTEMPTS = 10;

export function AccessGate() {
  const router = useRouter();
  const [state, setState] = useState<AccessState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    setState({ status: "loading", message: "Verificando acceso..." });

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setState({ status: "success", message: SUCCESS_MESSAGE });

        // Espera corta para que el usuario perciba el feedback de éxito
        // y para que el screen reader anuncie el cambio antes del scroll.
        await new Promise((resolve) => setTimeout(resolve, 350));

        // Re-fetch de Server Components: ahora <DataRoom /> reemplaza
        // a <AccessGate /> sin recarga dura.
        try {
          await router.refresh();
        } catch {
          // router.refresh es sincrónico en Next.js 15, pero si alguna
          // versión interna rechaza, no debe romper la UX de autenticación.
        }

        // Espera a que el nuevo DOM esté listo antes de scrollear.
        // Se intenta varias veces por si React tarda en commitear.
        scrollToDataRoom();
      } else {
        setState({
          status: "error",
          message: "Contraseña incorrecta. Verifica e intenta nuevamente.",
        });
      }
    } catch {
      setState({
        status: "error",
        message: "Error de conexion. Intenta nuevamente.",
      });
    }
  }

  /**
   * Hace scroll al inicio de la sección #data-room.
   * Usa requestAnimationFrame como red de seguridad para esperar a que
   * el DOM actualizado esté montado. Después del scroll, enfoca el h2
   * del Data Room para usuarios con screen reader.
   *
   * Los callbacks pueden sobrevivir al desmontaje de AccessGate porque
   * DataRoom lo reemplaza en el árbol. Son finitos (10 intentos) y solo
   * leen del DOM, por lo que no representan un memory leak relevante.
   */
  function scrollToDataRoom() {
    const tryScroll = (attempts: number) => {
      const target = document.getElementById(DATA_ROOM_ID);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        const heading = target.querySelector("h2");
        if (
          heading instanceof HTMLElement &&
          heading.id === DATA_ROOM_HEADING_ID
        ) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
        return;
      }
      if (attempts > 0) {
        requestAnimationFrame(() => tryScroll(attempts - 1));
      }
    };
    // ~10 frames a 60fps ≈ 160ms; suficiente para el commit de React.
    tryScroll(SCROLL_ATTEMPTS);
  }

  return (
    <section
      id="acceso"
      aria-labelledby="acceso-heading"
      className="bg-sky-900 py-20 md:py-28 scroll-mt-16 lg:scroll-mt-18"
    >
      <hr className="section-divider" />
      <Container size="narrow">
        <div>
          <h2 id="acceso-heading" className="text-h2 text-cream">
            Acceso al Data Room
          </h2>
          <p className="mt-4 text-body text-cream/85">
            Ingresa la contraseña compartida para consultar la documentación
            privada del Data Room.
          </p>
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={handleSubmit}
            aria-busy={state.status === "loading"}
          >
            <PasswordInput
              id="dataroom-password"
              label="Contraseña"
              name="password"
              required
              error={state.status === "error" ? state.message ?? null : null}
            />
            <Button
              type="submit"
              fullWidth
              disabled={state.status === "loading" || state.status === "success"}
            >
              Acceder
            </Button>
            <p
              aria-live="polite"
              className={`mt-3 min-h-5 text-sm ${
                state.status === "error"
                  ? "text-gold-300"
                  : "text-cream/75"
              }`}
            >
              {state.message ?? ""}
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
