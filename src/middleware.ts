import { defineMiddleware } from "astro:middleware";
import { getSiteSettings } from "./sanity/lib/queries";
import { getPerspectiveCookie } from "./lib/draft-mode";

const SKIP_PREFIXES = ["/studio", "/api/"];

function stripTrailingSlash(path: string): string {
	return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || /\.[a-z0-9]+$/i.test(pathname)) {
		return next();
	}

	const { data: siteSettings } = await getSiteSettings(getPerspectiveCookie(context.cookies));
	const current = stripTrailingSlash(pathname);
	const match = siteSettings?.redirects?.find((rule) => stripTrailingSlash(rule.source) === current);

	if (match) {
		return context.redirect(match.destination, match.permanent === false ? 302 : 301);
	}

	return next();
});
