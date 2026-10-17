/**
 * Every /features/<slug> page. Pages normally live in Sanity ("Feature Page"
 * documents); a file here is a code fallback, listed below. /features itself is the
 * separate features overview, untouched by these.
 */
import { AI_CREATOR_SEARCH } from "./ai-creator-search";
import type { FeaturePage } from "./types";

export const FEATURE_PAGES: FeaturePage[] = [AI_CREATOR_SEARCH];

export const featurePageHref = (slug: string) => `/features/${slug}/`;

export type { FeaturePage } from "./types";
export * from "./shared";
