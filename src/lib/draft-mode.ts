import type { AstroCookies } from "astro";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

// The Presentation tool sets this cookie via /api/draft-mode/enable. Its
// presence is what flips a request from published content to drafts —
// driven by Sanity, not a flag we flip in code.
export function isDraftMode(cookies: AstroCookies): boolean {
	return cookies.has(perspectiveCookieName);
}

export function getPerspectiveCookie(cookies: AstroCookies): string | undefined {
	return cookies.get(perspectiveCookieName)?.value;
}
