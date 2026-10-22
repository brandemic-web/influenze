/**
 * Every /compare/<slug> page. To add a competitor: copy upfluence.ts, fill in its
 * half, and list it here. The route, sitemap entry and layout come for free.
 */
import type { Competitor } from "./types";
import { UPFLUENCE } from "./upfluence";

export const COMPETITORS: Competitor[] = [UPFLUENCE];

// preview.yml is the only build that sets PUBLIC_DEV_GA_ID, so drafts reach dev and
// PR previews but never a production deploy.
export const SHOW_DRAFTS = import.meta.env.DEV || Boolean(import.meta.env.PUBLIC_DEV_GA_ID);

export const compareHref = (slug: string) => `/comparison/${slug}/`;

export type { Competitor, CompetitorCell } from "./types";
export * from "./shared";
