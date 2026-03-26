import { z } from "zod";

export const LOCALES = ["ka", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ka";

export const localeSchema = z.enum(LOCALES);
