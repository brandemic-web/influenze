/**
 * Every /alternatives/<slug> page. Competitors normally live in Sanity ("Alternative
 * Page" documents); a file here is a code fallback, listed below.
 */
import type { AlternativeCompetitor } from "./types";
import { UPFLUENCE_ALTERNATIVE } from "./upfluence";

export const ALTERNATIVES: AlternativeCompetitor[] = [UPFLUENCE_ALTERNATIVE];

export const alternativeHref = (slug: string) => `/alternatives/${slug}/`;

export type { AlternativeCompetitor } from "./types";
export * from "./shared";
