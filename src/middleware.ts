import { defineMiddleware } from "astro:middleware";
import { getRedirects, type RedirectDoc } from "./sanity/lib/queries";

// getRedirects() goes through loadQuery.ts's own publishedCache (15s TTL,
// keyed by query string) — no perspective cookie is passed, so every call
// here is already served from that shared cache rather than hitting Sanity
// per request. No second cache needed on top of it.

// Independent of Layout.astro's trailing-slash convention (which always adds
// one, for the canonical URL): this just needs "/old-page" and "/old-page/"
// in a redirect's `source` to match the same request path.
function normalize(pathname: string): string {
	return pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	// Never redirect Studio or the draft-mode API — both need every request
	// to reach their own handler untouched.
	if (pathname.startsWith("/studio") || pathname.startsWith("/api/")) {
		return next();
	}

	let redirects: RedirectDoc[];
	try {
		redirects = (await getRedirects()).data ?? [];
	} catch {
		// A Sanity blip shouldn't take the whole site down — fall through to
		// the normal route.
		return next();
	}

	const match = redirects.find((r) => normalize(r.source) === normalize(pathname));
	if (match) {
		return context.redirect(match.destination, match.permanent === false ? 302 : 301);
	}

	return next();
});
