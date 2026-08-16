/**
 * Catalog - typed registry of all PDFs available in the data room.
 *
 * Source of truth for the download route. Each entry maps:
 *   - id        : URL slug used by /api/download/[id]
 *   - title     : user-facing document name (es-CL)
 *   - description : one-line summary shown on the card
 *   - category  : grouping used by the DataRoom section
 *   - envKey    : name of the env var holding the R2 object key
 *   - filename  : filename suggested to the browser on download
 */

export type DocumentCategory = "gestion-soberana" | "inversores";

export interface DocumentEntry {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  envKey: string;
  filename: string;
}

export const CATALOG: DocumentEntry[] = [
  {
    id: "memorandum-interes-nacional",
    title: "Memorandum Interés Nacional",
    description: "Documento marco de interés nacional.",
    category: "gestion-soberana",
    envKey: "DOC_KEY_MEMORANDUM_NACIONAL",
    filename: "Memorandum_Interes_Nacional.pdf",
  },
  {
    id: "sroi-licencia-social",
    title: "SROI Licencia Social",
    description: "Retorno social sobre inversión y licencia.",
    category: "gestion-soberana",
    envKey: "DOC_KEY_SROI_LICENCIA_SOCIAL",
    filename: "SROI_Licencia_Social.pdf",
  },
  {
    id: "anexo-compromiso-social",
    title: "Anexo Compromiso Social",
    description: "Compromisos sociales documentados.",
    category: "gestion-soberana",
    envKey: "DOC_KEY_ANEXO_COMPROMISO_SOCIAL",
    filename: "Anexo_Compromiso_Social.pdf",
  },
  {
    id: "carpeta-legal",
    title: "Carpeta Legal",
    description: "Documentación legal completa.",
    category: "gestion-soberana",
    envKey: "DOC_KEY_CARPETA_LEGAL",
    filename: "Carpeta_Legal.pdf",
  },
  {
    id: "investment-memorandum",
    title: "Investment Memorandum",
    description: "Memorando para potenciales inversores.",
    category: "inversores",
    envKey: "DOC_KEY_INVESTMENT_MEMORANDUM",
    filename: "Investment_Memorandum.pdf",
  },
  {
    id: "modelo-financiero",
    title: "Modelo Financiero",
    description: "Proyecciones y modelo financiero.",
    category: "inversores",
    envKey: "DOC_KEY_MODELO_FINANCIERO",
    filename: "Modelo_Financiero.pdf",
  },
  {
    id: "infraestructura-critica",
    title: "Infraestructura Crítica",
    description: "Detalle de infraestructura crítica.",
    category: "inversores",
    envKey: "DOC_KEY_INFRAESTRUCTURA_CRITICA",
    filename: "Infraestructura_Critica.pdf",
  },
];

export function findDocument(id: string): DocumentEntry | undefined {
  return CATALOG.find((doc) => doc.id === id);
}

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  "gestion-soberana": "Gestión soberana",
  inversores: "Inversores",
};

export const CATEGORY_ORDER: DocumentCategory[] = [
  "gestion-soberana",
  "inversores",
];