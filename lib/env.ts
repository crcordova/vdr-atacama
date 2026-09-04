import { z } from "zod";

/**
 * Server-side environment variable validation.
 *
 * This module MUST only be imported from server components, route handlers,
 * or server actions. Importing it from a client component will fail because
 * server-only secrets are not available in the browser bundle.
 *
 * The schema is evaluated once at boot. If any required variable is missing
 * or invalid, parsing throws a ZodError so the failure is loud and obvious
 * instead of producing a half-broken production deployment.
 */
const envSchema = z.object({
  // Auth
  DATAROOM_PASSWORD: z.string().min(1, "DATAROOM_PASSWORD is required"),

  // Cloudflare R2 (S3-compatible)
  R2_ACCOUNT_ID: z.string().min(1, "R2_ACCOUNT_ID is required"),
  R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID is required"),
  R2_SECRET_ACCESS_KEY: z
    .string()
    .min(1, "R2_SECRET_ACCESS_KEY is required"),
  R2_BUCKET: z.string().default("vdr-atacama"),
  R2_ENDPOINT: z.string().url("R2_ENDPOINT must be a valid URL"),

  // Document keys (R2 object keys)
  DOC_KEY_MEMORANDUM_NACIONAL: z.string().min(1),
  DOC_KEY_SROI_LICENCIA_SOCIAL: z.string().min(1),
  DOC_KEY_ANEXO_COMPROMISO_SOCIAL: z.string().min(1),
  DOC_KEY_CARPETA_LEGAL: z.string().min(1),
  DOC_KEY_INVESTMENT_MEMORANDUM: z.string().min(1),
  DOC_KEY_FICHAS_TECNICAS_SPVS: z.string().min(1),
  DOC_KEY_EQUIPO_GOBERNANZA: z.string().min(1),
  DOC_KEY_TABLA_FINANCIERA_CONSOLIDADA: z.string().min(1),
  DOC_KEY_ANEXO_LEGAL: z.string().min(1),

  // Video (R2 object key for the home-page video)
  VIDEO_R2_KEY: z.string().min(1).default("Destino Atacama YT.mp4"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);