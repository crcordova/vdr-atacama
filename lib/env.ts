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
  DOC_KEY_MODELO_FINANCIERO: z.string().min(1),
  DOC_KEY_INFRAESTRUCTURA_CRITICA: z.string().min(1),

  // Public (exposed to the client bundle via NEXT_PUBLIC_ prefix)
  NEXT_PUBLIC_VIDEO_URL: z
    .string()
    .url("NEXT_PUBLIC_VIDEO_URL must be a valid URL"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);