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
    id: "fichas-tecnicas-spvs",
    title: "Fichas Técnicas SPVs",
    description: "Fichas técnicas de los vehículos (SPVs).",
    category: "inversores",
    envKey: "DOC_KEY_FICHAS_TECNICAS_SPVS",
    filename: "Fichas-Tecnicas-SPVs.pdf",
  },
  {
    id: "equipo-gobernanza",
    title: "Equipo Gobernanza",
    description: "Equipo y estructura de gobernanza.",
    category: "inversores",
    envKey: "DOC_KEY_EQUIPO_GOBERNANZA",
    filename: "Equipo-Gobernanza.pdf",
  },
  {
    id: "tabla-financiera-consolidada",
    title: "Tabla Financiera Consolidada",
    description: "Tabla financiera consolidada.",
    category: "inversores",
    envKey: "DOC_KEY_TABLA_FINANCIERA_CONSOLIDADA",
    filename: "Tabla-Financiera-Consolidada.pdf",
  },
  {
    id: "anexo-legal",
    title: "Anexo Legal",
    description: "Anexo legal del proyecto.",
    category: "inversores",
    envKey: "DOC_KEY_ANEXO_LEGAL",
    filename: "Anexo-Legal.pdf",
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
  "inversores",
  "gestion-soberana",
];