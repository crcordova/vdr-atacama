# VDR Atacama

Portal público-invitado para inversionistas del proyecto **VDR Atacama**.
Single-page marketing/investor portal con data room privado.

## Stack

- Next.js 15 (App Router)
- TypeScript estricto
- Tailwind v4
- Cloudflare R2 (S3-compatible, vía `@aws-sdk/client-s3`)
- Zod para validación de variables de entorno
- Deploy en Vercel

## Setup local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar el archivo de variables de entorno de ejemplo:

   ```bash
   cp .env.example .env.local
   ```

3. Completar `.env.local` con valores reales para:
    - `DATAROOM_PASSWORD` (password compartido del data room)
    - Credenciales de Cloudflare R2 (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
       `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT`)
    - `VIDEO_R2_KEY` (opcional, default `Destino Atacama YT.mp4`): clave del
        objeto R2 que contiene el video institucional de la home.

    El componente `VideoSection` de la home genera, en tiempo de renderizado,
   una URL firmada (presigned) de Cloudflare R2 con validez de aproximadamente
   4 horas, y el navegador descarga el MP4 directamente desde R2. `VIDEO_R2_KEY`
   determina qué objeto de R2 se utiliza. Si el bucket es público y se prefiere
   servir el video desde una URL pública de la CDN, se puede usar
   `NEXT_PUBLIC_VIDEO_URL` apuntando a la URL pública del objeto en vez del
   mecanismo por defecto de URL firmada.

4. Arrancar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Verificar tipos en cualquier momento:

   ```bash
   npm run typecheck
   ```

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Next.js) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción (requiere build previo) |
| `npm run lint` | ESLint con `eslint-config-next` |
| `npm run typecheck` | TypeScript en modo verificación (sin emitir) |

## Estructura

```
app/
├── app/            # Rutas (App Router): layout, page, globals.css
├── lib/            # Utilidades compartidas: env (Zod), auth, R2, catálogo
├── public/         # Assets estáticos (background.png, etc.)
├── components/     # Componentes React (Fase 2+)
├── .env.example    # Plantilla de variables de entorno
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

## Limitaciones conocidas

- **Password compartido**: el acceso al data room está protegido por un único
  password (`DATAROOM_PASSWORD`) comparado con `crypto.timingSafeEqual`. Si el
  password se filtra, debe rotarse manualmente. Aceptado por alcance.
 - **Sin DB, sin multi-tenant** — el alcance es minimal. Se usa Vercel Web
   Analytics básico (page views) vía `@vercel/analytics` en plan Hobby. Custom
   events y análisis de comportamiento avanzado no están disponibles en Hobby
   (requieren plan Pro u otra herramienta externa), por lo que no se trackean
   reproducciones de video ni interacciones del data room. Ver
   `docs/ANALYTICS_DECISION.md` para el contexto de la decisión.

## Documentación

Ver `docs/PROJECT.md` para el documento maestro y el plan de slices por fases.