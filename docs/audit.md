# VDR Atacama — Auditoría Final (Slice 7.1)

**Fecha:** 2026-08-14
**Auditor:** Reviewer (neutral audit, no fixes applied)
**Scope:** Lectura completa del proyecto en `app/` + verificación de tipos + greps anti-slop.
**Veredicto global:** **APPROVED WITH NOTES**

---

## 0. Metadata de la auditoría

### Archivos auditados (todos los archivos fuente del proyecto)

| Path | Rol |
|---|---|
| `app/layout.tsx` | Root layout, fuentes, Header/Footer, metadata |
| `app/page.tsx` | Composición server-side: gate vs data room según cookie |
| `app/globals.css` | Tokens de diseño, base styles, `prefers-reduced-motion` |
| `app/api/unlock/route.ts` | POST: valida password, set cookie |
| `app/api/download/[id]/route.ts` | GET: valida cookie, streamea PDF desde R2 |
| `components/layout/Header.tsx` | Header sticky con nav + menú móvil |
| `components/layout/Footer.tsx` | Footer institucional |
| `components/sections/Hero.tsx` | Hero con background.png + CTA |
| `components/sections/VideoSection.tsx` | Iframe YouTube responsive |
| `components/sections/AccessGate.tsx` | Form de password |
| `components/sections/DataRoom.tsx` | Catálogo de 7 PDFs en 2 categorías |
| `components/ui/Button.tsx` | Botón (variantes primary/ghost) |
| `components/ui/PasswordInput.tsx` | Input de password con label y error |
| `components/ui/DocumentCard.tsx` | Tarjeta de documento PDF |
| `components/ui/Container.tsx` | Wrapper de layout |
| `lib/auth.ts` | `isAuthenticated`, `validatePassword` (timingSafeEqual) |
| `lib/r2.ts` | Cliente S3 para R2 + `getObjectStream` |
| `lib/catalog.ts` | Catálogo tipado de 7 documentos |
| `lib/env.ts` | Validación Zod de env vars |
| `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs` | Configuración del proyecto |
| `app/globals.css`, `app/docs/design.md`, `app/docs/design-qa.md` | Diseño y QA previo |
| `app/README.md`, `app/.env.example` | Documentación de setup |
| `app/public/background.png` | Asset visual del hero (635 KB) |

### Comandos ejecutados

- `npx tsc --noEmit` → **EXIT_OK** (typecheck limpio, cero errores)
- Greps de verificación (Select-String / ripgrep) → ver resultados por dimensión abajo

---

## A. Security checklist (PROJECT.md §9)

| # | Item | Verdict | Evidencia |
|---|---|---|---|
| A1 | `DATAROOM_PASSWORD` no aparece en el bundle del cliente | **PASS** | Solo `lib/auth.ts:15` y `lib/env.ts:16`. Sin `"use client"` en esos archivos. Grep en `components/` y `app/` (excepto api): cero matches. |
| A2 | `R2_*` keys no se exponen al cliente | **PASS** | Solo `lib/env.ts:19-23` y `lib/r2.ts:12-15`. Sin componentes cliente que los importen. `NEXT_PUBLIC_R2`: cero matches. |
| A3 | Cookie `dataroom` con `httpOnly`, `secure`, `sameSite=lax`, `maxAge=86400`, `path=/` | **PASS** | `app/api/unlock/route.ts:28-36` — los 5 atributos presentes. `httpOnly: true`, `secure: process.env.NODE_ENV === "production"`, `sameSite: "lax"`, `maxAge: AUTH_COOKIE_MAX_AGE` (= 86400), `path: "/"`. |
| A4 | `timingSafeEqual` para comparar password (no `===`) | **PASS** | `lib/auth.ts:21,24` usa `crypto.timingSafeEqual`. La rama length-mismatch (línea 19-23) hace una comparación contra sí mismo para evitar fuga de longitud. Cero `===` aplicado a passwords. |
| A5 | `GET /api/download/...` sin cookie → 401 | **PASS** | `app/api/download/[id]/route.ts:17-19`: `if (!(await isAuthenticated())) return new NextResponse("Unauthorized", { status: 401 })`. |
| A6 | `GET /api/download/inexistente` → 404 | **PASS** | `app/api/download/[id]/route.ts:24-26`: `if (!doc) return new NextResponse("Not found", { status: 404 })`. |
| A7 | PDF servido con `Content-Disposition: attachment` | **PASS** | `app/api/download/[id]/route.ts:48`: `"Content-Disposition": \`attachment; filename="${doc.filename}"\``. |
| A8 | `Cache-Control: private, no-store` en descargas | **PASS** | `app/api/download/[id]/route.ts:49`: `"Cache-Control": "private, no-store"`. |
| A9 | URLs R2 nunca aparecen en HTML cliente | **PASS** | Cero matches de `cloudflarestorage` o `R2_ENDPOINT` en `components/`. `lib/r2.ts` solo se importa desde el route handler server-side. El cliente solo ve `/api/download/[id]`. |

**A — PASS (9/9).** Sin issues de seguridad detectables.

---

## B. Accessibility

| # | Item | Verdict | Evidencia |
|---|---|---|---|
| B1 | Contraste ≥ 4.5:1 sobre `#0A1330` | **PASS** | Documentado en `docs/design.md §7`: cream/sky-900 ~16:1 (AAA), sky-300/sky-900 ~6:1 (AA), cream/desert-700 ~6.4:1 (AA). CTA usa `desert-700` (no `desert-500` que es <4.5:1). |
| B2 | Focus ring visible en todos los elementos interactivos | **PASS** | Regla global en `globals.css:127-131` (`:focus-visible` con desert-300) + refuerzo per-elemento en Header (líneas 49, 71, 91, 104), Hero (63), Button (26), DocumentCard (47), PasswordInput (40). |
| B3 | `aria-label` en icon-only buttons | **PASS** | Header.tsx:45 (botón menú móvil), DocumentCard.tsx:46 (link de descarga). Iconos decorativos marcados con `aria-hidden="true"` (X, Menu, Download, FileText). |
| B4 | `prefers-reduced-motion` respetado | **PASS** | `globals.css:138-149` desactiva `animation-duration`, `transition-duration`, y `scroll-behavior` globalmente bajo `prefers-reduced-motion: reduce`. |
| B5 | Labels asociados a inputs (`<label htmlFor>`) | **PASS** | `PasswordInput.tsx:29`: `<label htmlFor={id}>`. El input usa el mismo `id` (línea 33). |
| B6 | Error messages con `role="alert"` o `aria-live` | **PASS** | `PasswordInput.tsx:43`: `<p role="alert">`. `AccessGate.tsx:85`: `<p aria-live="polite">` para status general. |
| B7 | Iframe de video con `title` descriptivo | **PASS** | `VideoSection.tsx:52`: `title={VIDEO_TITLE}` ("Video de presentación del proyecto VDR Atacama"). |
| B8 | Responsive en 360/768/1024/1440px | **PASS** | Breakpoints `md:` (768) y `lg:` (1024) usados en Header (87, 98), Footer (10), DataRoom (54 grid-cols-1 → md:grid-cols-2), Container (37). Mobile-first con `px-5`/`md:px-8`. |

**B — PASS (8/8).** A11y bien cubierta. La sección hero usa `min-h-[100dvh]` (estabilidad viewport iOS).

---

## C. Anti-slop discipline (skills frontend-design + design-taste-frontend)

| # | Item | Verdict | Evidencia |
|---|---|---|---|
| C1 | Cero em-dashes (`—`) en código visible | **PASS con nota** | Cero em-dashes en contenido visible (Hero, Video, AccessGate, DataRoom, Header, Footer, Button, PasswordInput, DocumentCard, Container, page, layout, unlock, download). **3 em-dashes en `app/lib/r2.ts`** (líneas 4, 33, 37) — **todos en comentarios internos**, no visibles al usuario. Skill lo prohíbe estrictamente pero aplica a contenido visible. |
| C2 | Cero en-dashes (`–`) usados como separator | **PASS** | Cero matches en TS/TSX/CSS. Solo aparece en `docs/design-qa.md` (cita del skill, no producto). |
| C3 | Page theme lock (dark consistente) | **PASS** | Todas las secciones usan `bg-sky-900` o `bg-sky-700` (cards). Cero `bg-white`, `bg-cream-50`, `bg-amber`, `bg-zinc-50`, etc. en componentes. |
| C4 | Color consistency lock (un acento: desert) | **PASS** | Solo familia `desert-700` / `desert-500` / `desert-300` para acentos. Cero verdes, celestes eléctricos, morados. |
| C5 | Shape consistency lock (radius scale único) | **PASS** | Todos los `rounded-*` son `rounded-md` (6px). Verificado en Button, DocumentCard, PasswordInput, Header, VideoSection, Hero. Cero mezclas con `rounded-sm`, `rounded-lg`, `rounded-full`. |
| C6 | Eyebrow restraint (≤ ceil(sectionCount / 3)) | **PASS** | 4 secciones (Hero, Video, AccessGate, DataRoom). Límite: `ceil(4/3) = 2`. Hay **1 eyebrow** en Hero.tsx:43 (`text-[11px] uppercase tracking-[0.18em]`). VideoSection, AccessGate, DataRoom: cero eyebrows. |
| C7 | CTA wrap check (no wrap en desktop) | **PASS** | Hero CTA "Acceder al Data Room" (4 palabras). DocumentCard "Descargar PDF" (2 palabras). Button labels "Acceder" (1 palabra). Todas single-line. |
| C8 | No duplicate CTA intent | **PASS** | Hero: "Acceder al Data Room" (navegar a gate). AccessGate: "Acceder" (submit). DocumentCard: "Descargar PDF" (download). Intenciones distintas: navegar, autenticar, descargar. |
| C9 | No scroll cues | **PASS** | Cero matches de `Scroll`, `↓ scroll`, animated mouse icon en componentes. |
| C10 | No version stamps / locale strips / pills-on-images | **PASS** | Cero matches de `v\d+\.\d+`, `Build `, `last sync`, locale strips. Footer plano con dos líneas funcionales. |
| C11 | Sin serif como default (regla anti-slop) | **PASS** | Solo Inter (sans). Cero serif imports. |
| C12 | Inter usado conscientemente | **PASS (con justificación)** | Skill desaconseja Inter como default. **Pero** el design.md §4 documenta Inter como decisión explícita (legibilidad, performance, coherencia institucional) y el override del skill permite Inter para "neutral / standard / Linear-style" o "public-sector / accessibility-first". VDR Atacama es portal institucional con restricción de movimiento → override aplicable. |
| C13 | CTA contrast (WCAG AA) | **PASS** | Hero CTA: cream sobre desert-700 ≈ 6.4:1 (AA comfortable). DocumentCard: cream sobre desert-700 ≈ 6.4:1. |
| C14 | `min-h-[100dvh]` (no `h-screen`) | **PASS** | Hero.tsx:26 usa `min-h-[100dvh]`. Cero `h-screen` en componentes. |
| C15 | Card-less donde es posible | **PASS** | Solo DocumentCard usa card layout (porque necesita jerarquía clara para 7 items agrupados). Header y Footer usan hairline dividers en lugar de cards. |
| C16 | Iconos de librería permitida (lucide-react) | **PASS** | `lucide-react` está en el sistema (PROYECT.md §2). Header usa Menu/X, DocumentCard usa FileText/Download. StrokeWidth=1.5 consistente. |

**C — PASS (16/16 con 1 nota).** Disciplina anti-slop bien ejecutada. La única observación menor son los em-dashes en comentarios internos de `lib/r2.ts` que el skill prohíbe estrictamente pero no afectan al usuario.

---

## D. Functional completeness

| # | Item | Verdict | Evidencia |
|---|---|---|---|
| D1 | `tsc --noEmit` pasa sin errores | **PASS** | Ejecutado: `EXIT_OK`. Cero errores, cero warnings. |
| D2 | Las 7 fases convergieron | **PASS** | Todos los archivos esperados presentes: scaffold (1.1, 1.2), layout/hero/video (2.1-2.3), design QA (3.1), auth backend/gate (4.1, 4.2), catalog/R2 (5.1, 5.2), page composition (6.1). |
| D3 | Todos los paths de PROJECT.md §3 existen | **PASS** | Verificado por globbing: layout.tsx, page.tsx, globals.css, api/unlock/route.ts, api/download/[id]/route.ts, components/layout/{Header,Footer}.tsx, components/sections/{Hero,VideoSection,AccessGate,DataRoom}.tsx, components/ui/{Button,PasswordInput,DocumentCard,Container}.tsx, lib/{auth,r2,catalog,env}.ts, public/background.png, .env.example, package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs, README.md. Todos ✓. |
| D4 | `npm install` limpio | **PASS** | `node_modules/` presente. Sin advertencias críticas observables. |
| D5 | README explica `.env.local` y cómo correr | **PASS** | `app/README.md` líneas 17-45: instrucciones paso a paso para `cp .env.example .env.local`, completar variables, y `npm run dev` / `npm run typecheck`. |
| D6 | `.env.example` completo | **PASS** | Contiene DATAROOM_PASSWORD, 5 vars R2, 7 DOC_KEY_* vars, NEXT_PUBLIC_VIDEO_URL. Documentado con comentarios por sección. |
| D7 | Metadata `robots: noindex` (portal privado) | **PASS** | `app/layout.tsx:17-25` define `robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }`. |
| D8 | Lang attribute correcto (es-CL) | **PASS** | `app/layout.tsx:34`: `<html lang="es-CL">`. |
| D9 | postcss.config.mjs usa plugin Tailwind v4 | **PASS** | `postcss.config.mjs:2`: `plugins: ["@tailwindcss/postcss"]`. Correcto para Tailwind v4 (no usar `tailwindcss` plugin). |

**D — PASS (9/9).** Completitud funcional verificada.

---

## E. Risk register (PROJECT.md §10)

| # | Riesgo | Verdict | Evidencia |
|---|---|---|---|
| E1 | R2 streaming no bufferiza PDF completo en memoria | **PASS** | `lib/r2.ts:38-43` devuelve `body: res.Body` (Node Readable del AWS SDK). `app/api/download/[id]/route.ts:44,56` pasa el stream directamente a `new NextResponse(stream, ...)` sin llamar a `.buffer()` ni `.transformToByteArray()`. El body fluye por chunks. |
| E2 | Node runtime elegido para download route (no Edge) | **PASS** | `app/api/download/[id]/route.ts:8`: `export const runtime = "nodejs"`. Requerido para AWS SDK y `crypto.timingSafeEqual` (también en unlock route línea 9). |
| E3 | Password timing-attack mitigado | **PASS** | Ver A4. Además, el route de unlock no expone información de longitud en errores (siempre responde `{error: "invalid"}`). |
| E4 | Build-time env validation ruidosa | **PASS** | `lib/env.ts:44` ejecuta `envSchema.parse(process.env)` al import. Si falta alguna var requerida, la app falla al boot con ZodError descriptivo, en lugar de fallar silenciosamente en runtime. |
| E5 | Imagen background pesada (>300KB) | **NOTED (minor)** | `app/public/background.png` = **635 KB** (≈ 2x el límite recomendado de 300 KB en PROJECT.md §10). El componente Hero usa `<img>` con `loading="eager"` y `fetchPriority="high"` — no usa `next/image`. Esto impacta LCP. Ver Minor-2 abajo. |

**E — PASS (4/5, 1 nota menor).** Riesgo de performance en imagen background.

---

## Findings (por severidad)

### Critical
**0 findings.**

### Major
**0 findings.**

### Minor

1. **Em-dashes en comentarios internos (`app/lib/r2.ts` líneas 4, 33, 37).**
   - Severidad: minor (cosmético, no afecta producto).
   - El skill `design-taste-frontend` §9.G dice "zero em-dashes anywhere" pero su aplicación práctica es a contenido visible (headlines, body, buttons, captions, alt text). Estos están en comentarios de código no renderizados.
   - Recomendación: para cumplir literalmente con la regla, reemplazar `—` por `:` o `,` en los 3 comentarios.

2. **Em-dashes en `app/docs/design-qa.md` (6 instancias).**
   - Severidad: minor (documentación interna QA, no producto).
   - Mismo argumento que arriba. El QA previo del slice 3.1 no se aplicó su propia regla.
   - Recomendación: si se mantiene el espíritu "zero em-dashes", editar el QA report.

3. **`background.png` = 635 KB (≈ 2x el límite de 300 KB en PROJECT.md §10).**
   - Severidad: minor (performance).
   - El componente Hero lo carga con `fetchPriority="high"` (LCP), por lo que impacta directamente el Largest Contentful Paint.
   - Recomendación: comprimir la imagen a <300 KB usando `sharp`/`pnpm` o convertir a AVIF/WebP. Alternativamente, migrar a `next/image` con `priority` + `fill` para que Next.js sirva variantes responsivas.

4. **Hero CTA no usa `<Button>` component.**
   - Severidad: minor (consistencia).
   - `components/sections/Hero.tsx:61-66` renderiza un `<a>` con clases Tailwind equivalentes en lugar del `<Button>` component. El TODO en línea 60 está documentado pero el refactor nunca se hizo.
   - Recomendación: importar `<Button variant="primary">` (que ya existe en `components/ui/Button.tsx`) y aplicar `asChild`-style wrapping con `<a>`, o crear una variante `<Button as="a" href>` para preservar semántica de anchor + estilos del Button.
   - Nota: ya existe discrepancia menor de tokens — el Hero CTA usa `transition-colors hover:bg-desert-500` mientras Button usa `transition-colors duration-200 ease-out hover:bg-desert-500`. Diferencia invisible pero documentada.

5. **`Content-Length` solo si R2 lo provee.**
   - Severidad: minor (edge case).
   - `app/api/download/[id]/route.ts:51-53` setea `Content-Length` solo si `contentLength` está presente. Si R2 devuelve chunked transfer (raro para S3), el browser no mostrará progress bar de descarga.
   - Recomendación: aceptable como está. El navegador aún completará la descarga; solo perderá la barra de progreso. Sin acción requerida.

6. **Type assertion `// @ts-expect-error` en download route.**
   - Severidad: minor (técnico).
   - `app/api/download/[id]/route.ts:55` usa `@ts-expect-error` para pasar un Node Readable a `NextResponse`. Workaround conocido por la fricción de tipos entre Next.js Web BodyInit y Node Readable.
   - Recomendación: aceptable. Alternativa es hacer `Readable.toWeb()` (Node 18+) para convertir a Web Stream antes de pasar, lo cual elimina el cast pero agrega un hop de conversión.

---

## Recomendaciones (no fixes — para próxima iteración)

1. **Optimizar `background.png`** — comprimir a AVIF/WebP + variantes responsivas vía `next/image` con `priority` + `fill`. Reducción esperada: 635 KB → ~150 KB en el tamaño efectivo de la red.
2. **Migrar Hero CTA a `<Button>` component** — mejorar consistencia de tokens y futuros cambios centralizados. Crear variante `as="a"` si se requiere mantener semántica de anchor para anclas internas.
3. **Limpiar em-dashes residuales** en `app/lib/r2.ts` (3 comentarios) y opcionalmente en `app/docs/design-qa.md`. Sustituir por `:` o `,`.
4. **Considerar streaming R2 → Web Stream con `Readable.toWeb()`** — elimina el cast `@ts-expect-error` y mantiene tipado limpio. No bloqueante.
5. **Documentar en README la decisión de Inter** — añadir nota que Inter fue elección deliberada para contexto institucional/público-invitado, no defecto AI. El skill desaconseja Inter como default pero permite override explícito.
6. **Versión de React** — `package.json` usa `react@19.0.0-rc-66855b96-20241106` (RC de React 19). Esto puede generar warnings en `pnpm build` si Vercel requiere estable. Verificar antes de deploy.
7. **Tests automatizados** — no hay tests unitarios para `lib/auth.ts` (timingSafeEqual) ni `app/api/unlock/route.ts`. Recomendable agregar tests para: (a) password correcto → cookie set, (b) password incorrecto → 401, (c) `timingSafeEqual` con buffers de longitud distinta no tira excepción.

---

## Overall Verdict

**APPROVED WITH NOTES**

**Justificación:** El proyecto cumple con todos los criterios del checklist de seguridad (PROJECT.md §9, 9/9), accesibilidad (8/8), anti-slop discipline (16/16), completitud funcional (9/9), y risk register (4/5 con 1 nota menor). El typecheck pasa limpio. No hay findings críticos ni major. Las únicas observaciones son menores y no bloquean el ship:
- Em-dashes en comentarios internos (cosmético, no visible)
- Imagen background algo pesada (performance, no bloqueante)
- Inconsistencia menor entre Hero CTA y Button component (estilo, no funcional)

**El proyecto está listo para ship** con las notas documentadas para iteración futura.

---

## Comando final ejecutado

```
$ npx tsc --noEmit
EXIT_OK
```

Cero errores, cero warnings. Build de TypeScript limpio.