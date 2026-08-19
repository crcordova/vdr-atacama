"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Container } from "@/components/ui/Container";

type AccessState = {
  status: "idle" | "loading" | "error" | "success";
  message?: string;
};

export function AccessGate() {
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
        setState({
          status: "success",
          message: "Acceso concedido. Cargando documentos...",
        });
        window.location.reload();
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

  return (
    <section
      id="acceso"
      aria-labelledby="acceso-heading"
      className="bg-sky-900 py-20 md:py-28 scroll-mt-16 lg:scroll-mt-[72px]"
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
              disabled={state.status === "loading"}
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
