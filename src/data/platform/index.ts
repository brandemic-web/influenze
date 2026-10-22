/**
 * Every /platforms/<slug> page. Pages normally live in Sanity ("Platform Page"
 * documents); a file here is a code fallback, listed below.
 */
import { INSTAGRAM } from "./instagram";
import type { PlatformPage } from "./types";

export const PLATFORM_PAGES: PlatformPage[] = [INSTAGRAM];

export const platformHref = (slug: string) => `/platforms/${slug}/`;

export type { PlatformPage } from "./types";
export * from "./shared";
