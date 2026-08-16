# VDR Atacama - Sistema de Diseno

Documento de diseno para el portal VDR Atacama. Define tokens, componentes base y disciplina visual que rigen todas las pantallas del proyecto. Los tokens viven en `app/app/globals.css` y se exponen como utilidades de Tailwind v4 via `@theme`.

---

## 1. Design Read

Lectura del brief en una linea:

> "Portal institucional de data room para inversionistas, con lenguaje calmo, editorial y de confianza, apoyado en Tailwind v4 + Inter + movimiento minimo."

El publico objetivo son asignadores de capital institucionales (family offices, fondos soberanos, VCs). El diseno prioriza legibilidad sobria, jerarquia clara y restricciones de movimiento por defecto. Nada de brillo gratuito.

---

## 2. Dial Values

Tres perillas globales que gobiernan todas las decisiones visuales:

| Dial | Valor | Justificacion (una linea) |
|---|---|---|
| `DESIGN_VARIANCE` | 5 | Composicion institucional medida: hero alineado a izquierda sobre fotografia, grid simetrico en data room, sin caos asimetrico. |
| `MOTION_INTENSITY` | 3 | Solo estados CSS `:hover` y `:active`; cero scroll triggers. El contexto de data room exige reserva y `prefers-reduced-motion` queda como modo por defecto. |
| `VISUAL_DENSITY` | 4 | Cuatro secciones + siete tarjetas; ritmo estandar con aire generoso (`py-20` a `py-32`), ni galeria vacia ni cabina apretada. |

Estas perillas se traducen en reglas concretas abajo. Si en una slice futura surge la necesidad de subir movimiento (por ejemplo, un reveal de tarjetas al entrar al viewport), se justifica caso por caso en el slice plan.

---

## 3. Paleta

Paleta cerrada de siete tokens, definida literalmente en `globals.css` bajo `@theme`. No se anaden acentos competidores.

| Token | Hex | Uso |
|---|---|---|
| `sky-900` | `#0A1330` | Background principal de pagina y secciones. |
| `sky-700` | `#13234D` | Superficies elevadas: cards del data room, header sticky, footer. |
| `sky-300` | `#7B92C9` | Texto secundario, hairlines, bordes sutiles, divisores. |
| `cream` | `#F5EFE0` | Texto principal y bordes de botones ghost sobre `sky-900`. |
| `desert-700` | `#A0411A` | Acento oscuro; CTA primario en estado base, badges discretos. |
| `desert-500` | `#C25A2E` | Hover de CTA, enlaces subrayados al pasar el cursor. |
| `desert-300` | `#E8915E` | Focus ring, halos suaves alrededor de iconos activos. |

Reglas de uso:

- **Un solo acento.** La familia `desert` es el unico acento. No se introducen verdes, celestes electricos ni morados.
- **Background lock.** Toda la pagina opera sobre `sky-900`. Las secciones no invierten a modo claro. Las cards usan `sky-700` como elevacion, no como cambio de tema.
- **Contraste.** Texto `cream` sobre `sky-900` entrega aproximadamente 16:1 (AAA). Texto `sky-300` sobre `sky-900` entrega aproximadamente 6:1 (AA para cuerpo).
- **No puro `#000` ni puro `#fff`.** El fondo es azul-noche profundo, los textos son crema calida. El contraste surge de la distancia cromatica, no de la pureza.

---

## 4. Tipografia

**Familia:** Inter, cargada via `next/font/google` en slice 2.1 (pendiente). Por ahora la familia esta declarada en `globals.css` como fallback seguro del sistema.

**Pesos en uso:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold). No se usa 800/900; la jerarquia se construye con tamano y tracking, no con grosor extremo.

**Escala bloqueada** (de PROJECT.md seccion 4):

| Token Tailwind | Tamano / Line-height | Letter-spacing | Uso |
|---|---|---|---|
| `text-display` | 64px / 72px | -0.02em | Hero principal (unico lugar donde aparece). |
| `text-h1` | 48px / 56px | -0.015em | Titulos de seccion cuando el ancho lo permite. |
| `text-h2` | 32px / 40px | -0.01em | Titulos de cards agrupadas (categorias del data room). |
| `text-h3` | 24px / 32px | normal | Titulos de tarjetas individuales, encabezados de formularios. |
| `text-body` | 16px / 24px | normal | Parrafos, descripciones, labels. |
| `text-small` | 14px / 20px | normal | Metadatos, helpers, pie de pagina. |

Reglas tipograficas:

- **Sin serif.** El stack es 100% sans. No se mezcla serif como enfasis decorativo (regla anti-slop).
- **Italic display con reserva.** Si alguna palabra en cursiva contiene descendente (`y g j p q`), el contenedor usa `leading-[1.1]` minimo y `pb-1` de reserva. Esto no se activa en este brief, pero queda documentado para auditorias futuras.
- **Sin em-dashes.** El caracter de guion largo esta prohibido en headlines, eyebrows, botones, pies y body copy. Se reemplaza por guion corto (`-`), coma, punto o parentesis.
- **Headlines sin romper con `<br>` por defecto.** Si una headline pide quiebre, se hace con un maximo de dos lineas en desktop via `text-balance`.

---

## 5. Espaciado y ritmo

**Anchos de contenedor:**

- `max-w-content` = 1200px (pagina completa, secciones principales).
- `max-w-narrow` = 720px (bloques de lectura, formulario de acceso).

**Padding vertical de secciones** (de menos a mas):

| Breakpoint | Padding y |
|---|---|
| Mobile (`<768px`) | 5rem |
| Tablet (`md`) | 6rem |
| Desktop (`lg`) | 8rem |

**Padding horizontal de contenedor (gutter):**

- Mobile: 1.25rem.
- Tablet en adelante: 2rem.

**Breakpoints** (estandar Tailwind):

- `sm`: 640px.
- `md`: 768px.
- `lg`: 1024px.
- `xl`: 1280px.
- `2xl`: 1536px.

**Altura de viewport:** las secciones que requieren ocupar pantalla completa usan `min-h-[100dvh]`. Nunca `h-screen` (regla anti-slop + estabilidad en Safari iOS).

**Reglas de grid:**

- Data room: dos columnas en desktop (`md:grid-cols-2`), una columna en mobile.
- Grupos por categoria: cada categoria ocupa su propia banda con titulo `h2` y un divisor hairline (`border-t border-sky-300/20`) arriba.
- Sin tarjetas vacias al final. Si una categoria tiene cuatro docs y la otra tres, se renderiza una cuadricula 2x2 y luego una 2x2 con una tarjeta "shadow" (placeholder discreto etiquetado "Proximamente") solo si la siguiente categoria la requiere. Por defecto, no se renderizan huecos.

---

## 6. Componentes base

Especificaciones breves para los componentes listados en PROJECT.md. La implementacion viva vivira en `components/ui/` y sera creada en slices posteriores.

### 6.1 Container

- Wrap de seccion con `max-w-content mx-auto` y `px-{gutter}`.
- Variantes: `default` (1200px), `narrow` (720px).
- Sin fondo propio; recibe fondo segun el seccion que lo contiene.
- HTML: `<div>` semantico, sin `role` extra.

### 6.2 Button

Dos variantes:

**Primary** (`desert-700` como base, `desert-500` en hover):

- Fondo: `bg-desert-700`.
- Texto: `text-cream`.
- Hover: `bg-desert-500` con `transition-colors duration-base ease-standard`.
- Activo: `scale-[0.98]` para feedback tactil.
- Focus: anillo `desert-300` (definido en `globals.css`).
- Padding: `px-6 py-3` desktop, `px-5 py-2.5` mobile.
- Radius: `rounded-md` (6px), consistente con todo el sistema.
- Tipografia: `text-body font-medium`.
- Contraste: cream sobre desert-700 entrega ~6.4:1 (AA confortable).

**Ghost** (sin fondo, borde cream):

- Fondo: transparente.
- Borde: `border border-cream/40`.
- Texto: `text-cream`.
- Hover: `bg-cream/5` y `border-cream`.
- Mismo padding, radius y tipografia que primary.

**Reglas transversales:**

- Etiquetas de uno a tres palabras. Sin truncamiento.
- Icono opcional a la izquierda (`lucide-react`, `strokeWidth=1.5`), NUNCA a la derecha salvo que sea un chevron.
- Un CTA primario por seccion. Si hay secundario, es variante ghost.
- Sin texto en mayuscula forzada.

### 6.3 DocumentCard

- Fondo: `bg-sky-700`.
- Borde: `border border-sky-300/15`.
- Radius: `rounded-md`.
- Padding: `p-6`.
- Composicion (vertical):
  1. Icono PDF (`lucide-react`, `FileText`, `strokeWidth=1.5`, color `text-desert-300`).
  2. Titulo `text-h3`.
  3. Descripcion `text-small text-sky-300` (una linea, truncada con `line-clamp-2` si es necesario).
  4. Boton de descarga, variante primary, etiqueta `Descargar`.
- Hover: eleva fondo a `bg-sky-700/80` con `transition-colors duration-base`, sin cambio de tamano ni sombra agresiva.
- Estado loading (descarga en curso): boton muestra `Loader2` con `animate-spin`. Disabled durante el stream.
- Estado error (descarga fallida): toast `aria-live="polite"` con texto plano: "No se pudo descargar el documento. Intentalo de nuevo." Sin emoji, sin icono de exclamacion rojo.

### 6.4 PasswordInput

- Input visual tipo `type="password"` con toggle de visibilidad (icono `Eye` / `EyeOff` de `lucide-react`).
- Label asociado por id (`<label htmlFor>`), siempre visible, nunca placeholder.
- Estado base: fondo `bg-sky-700`, borde `border-sky-300/30`, texto `text-cream`.
- Focus: borde `border-desert-300` + focus ring global.
- Estado error: borde `border-desert-500`, mensaje de ayuda debajo en `text-small text-desert-300`.
- Estado loading: boton de submit pasa a `disabled`, label cambia a "Verificando..." con icono spinner.
- Helper text con `aria-live="polite"` para anunciar exito y error a tecnologia asistiva.
- Mensajes en espanol neutro:
  - Error: "Contrasena incorrecta."
  - Vacio: "Ingresa la contrasena entregada por el equipo VDR Atacama."

---

## 7. Accesibilidad

**Contraste minimo WCAG AA (4.5:1 para cuerpo, 3:1 para texto grande).**

| Combinacion | Ratio aproximado | Veredicto |
|---|---|---|
| `cream` sobre `sky-900` | ~16:1 | AAA, uso libre. |
| `sky-300` sobre `sky-900` | ~6:1 | AA cuerpo, uso libre. |
| `cream` sobre `desert-700` | ~6.4:1 | AA cuerpo, CTA primario. |
| `cream` sobre `desert-500` | ~3.8:1 | AA solo para texto grande (>=18.66px bold). Por esto el CTA primario usa `desert-700`, no `desert-500`. |
| `desert-300` (focus ring) sobre `sky-900` | ~7.5:1 | Visible y distinto del fondo. |

**Focus management:**

- Regla global en `globals.css`: `:focus-visible` aplica outline `desert-300` con offset `2px`.
- Inputs anaden `border-desert-300` en estado focus ademas del outline.
- Skip-link opcional (futuro) si la pagina crece; por ahora, el header sticky provee navegacion directa.

**Movimiento reducido:**

- `@media (prefers-reduced-motion: reduce)` fuerza `animation-duration: 0.01ms` y `transition-duration: 0.01ms` globalmente.
- No hay animaciones decorativas que dependan de JS. Todo es CSS, asi que el override funciona sin JavaScript.

**Texto y semantica:**

- Una sola `h1` por pagina (en el hero).
- Orden jerarquico respetado: `h1` -> `h2` -> `h3`, sin saltar niveles.
- Inputs con `<label>` asociado. Helper text con `aria-describedby`.
- Mensajes de estado (error, exito) usan `aria-live="polite"`.
- Iconos decorativos con `aria-hidden="true"`. Iconos interactivos con `aria-label`.

---

## 8. Anti-patterns evitados

Disenos AI que se consideraron y se descartaron explicitamente en este proyecto:

1. **Hero centrado sobre gradiente morado/cyan.** Se reemplazo por composicion left-aligned sobre la fotografia `background.png` (cielo andino con constelaciones). El acento es desert orange, no neon.
2. **Tres tarjetas iguales en fila para "features".** El data room usa dos columnas agrupadas por categoria (`gestion-soberana` e `inversores`), no tres bloques simetricos.
3. **Paleta beige + brass + oxblood para "look premium".** Baneada por defecto por el skill. Se usa la paleta sky/desiert bloqueada por el spec, que es cromaticamente coherente con el referente visual (desierto de Atacama + cielo nocturno andino).
4. **El caracter de guion largo como flourish tipografico.** Cero em-dashes en headlines, eyebrows, botones ni body copy. Se usan guiones cortos, comas, puntos o parentesis.
5. **Micro-meta labels poeticos.** Sin "Del atelier", "Notas de campo", "En uso silenciosamente en...". Las categorias y los labels son planos y funcionales (`Descargar`, `Categoria`, `Inversores`).
6. **Grids con tarjetas vacias al final.** Si una categoria tiene menos documentos que otra, el grid se ajusta para no dejar celdas muertas.

---

## 9. Referencias visuales

Esta paleta es de autor. Nacio de la combinacion literal del lugar donde opera el proyecto:

- **Cielo nocturno andino.** El azul profundo `#0A1330` y sus variantes mas claras (`sky-700`, `sky-300`) evocan la altitud del desierto de Atacama con el cielo estrellado encima. La imagen `background.png` (ya presente en `public/`) lleva esta lectura al extremo con constelaciones y figuras andinas (llama, sol, espiral, voladores, figuras antropomorfas).
- **Suelo del desierto.** Los tonos desert (`desert-700`, `desert-500`, `desert-300`) son el cobre oxidado y la luz calida del atardecer atacameno. Se usan como acento unico, no como segundo tema.
- **Cremosidad andina.** El `cream` (`#F5EFE0`) es la calidez de la luz sobre textiles y ceramica local; da legibilidad sin caer en el blanco puro que mataria la atmosfera.

No hay una marca de referencia especifica. No se tomaron colores de Linear, Vercel, Stripe ni de ninguna plantilla. La eleccion es local y especifica al proyecto. Cualquier comparacion con paletas de AI-default (warm cream + brass) es deliberadamente rechazada por incompatibilidad con el referente visual.