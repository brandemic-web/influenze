import { APP_URL } from "../data/site";

/**
 * Signup attribution, the website half. The app reads the `iz_attr` cookie at
 * signup and the backend reports the conversion with it — see
 * backend/app/api/v1/utils/influenze_conversions.py.
 *
 * 1. Landing: ad click IDs, UTMs and an outside referrer go into `iz_attr` on
 *    `.influenze.ai`, so app.influenze.ai can read them.
 * 2. CTA click: a `signup_cta_click` dataLayer event, for GTM to forward to GA4.
 *    On PR previews (dev GA, no GTM) it goes to GA directly, and the saved tags
 *    ride along in the link, since the dev app can't read this site's cookies.
 */

const COOKIE = "iz_attr";
const MAX_AGE_S = 90 * 24 * 60 * 60;
const MAX_VALUE = 300;
const PARAMS = [
	"gclid",
	"gbraid",
	"wbraid",
	"fbclid",
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
];
const ROOT_DOMAIN = "influenze.ai";
const APP_HOST = new URL(APP_URL).host;

declare global {
	interface Window {
		dataLayer?: Record<string, unknown>[];
		gtag?: (...args: unknown[]) => void;
		/** Set by Layout.astro when dev GA loads without GTM (PR previews). */
		izDirectGa?: boolean;
	}
}

function isOwnHost(host: string): boolean {
	return host === ROOT_DOMAIN || host.endsWith(`.${ROOT_DOMAIN}`);
}

/** Origin and path only: a referrer's query string can carry someone else's data. */
function outsideReferrer(): string | null {
	try {
		const ref = new URL(document.referrer);
		const own = ref.hostname === location.hostname || isOwnHost(ref.hostname);
		return own ? null : `${ref.origin}${ref.pathname}`;
	} catch {
		return null;
	}
}

// Last non-direct touch wins: a visit with no click IDs, UTMs or outside
// referrer (typing the URL, moving between pages) keeps the one before it.
function captureLanding() {
	const query = new URLSearchParams(location.search);
	const touch: Record<string, string | number> = {};
	for (const key of PARAMS) {
		const value = query.get(key)?.trim();
		if (value) touch[key] = value.slice(0, MAX_VALUE);
	}
	const referrer = outsideReferrer();
	if (!Object.keys(touch).length && !referrer) return;

	if (referrer) touch.referrer = referrer.slice(0, MAX_VALUE);
	touch.landing_url = `${location.origin}${location.pathname}`.slice(0, MAX_VALUE);
	touch.captured_at = Date.now();

	// Without the Domain attribute (localhost, preview URLs) the cookie stays
	// on this host, which is all a test needs.
	const domain = isOwnHost(location.hostname) ? `; Domain=.${ROOT_DOMAIN}` : "";
	const secure = location.protocol === "https:" ? "; Secure" : "";
	document.cookie =
		`${COOKIE}=${encodeURIComponent(JSON.stringify(touch))}` +
		`; Path=/; Max-Age=${MAX_AGE_S}; SameSite=Lax${domain}${secure}`;
}

function savedTouch(): Record<string, unknown> {
	const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
	try {
		return raw ? JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) : {};
	} catch {
		return {};
	}
}

/** For an app on another domain (the dev app on previews): the tags go in the link. */
function carryTouch(link: HTMLAnchorElement) {
	if (isOwnHost(link.hostname)) return;
	const touch = savedTouch();
	const url = new URL(link.href);
	for (const key of PARAMS) {
		const value = touch[key];
		if (typeof value === "string" && !url.searchParams.has(key)) {
			url.searchParams.set(key, value);
		}
	}
	link.href = url.href;
}

/** Which part of the page the CTA sits in (`data-cta-location`), for comparing buttons in GA4. */
function ctaLocation(link: Element): string {
	return link.closest("[data-cta-location]")?.getAttribute("data-cta-location") || "page";
}

function trackCtaClicks() {
	// Capture phase, so it still records when a component stops propagation.
	document.addEventListener(
		"click",
		(event) => {
			const link = (event.target as Element | null)?.closest?.("a[href]");
			if (!(link instanceof HTMLAnchorElement)) return;
			if (link.host !== APP_HOST) return;
			carryTouch(link);
			const params = {
				cta_text: (link.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100),
				cta_location: ctaLocation(link),
				page_path: location.pathname,
			};
			if (window.izDirectGa && window.gtag) {
				window.gtag("event", "signup_cta_click", params);
				return;
			}
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({ event: "signup_cta_click", ...params });
		},
		true,
	);
}

captureLanding();
trackCtaClicks();
