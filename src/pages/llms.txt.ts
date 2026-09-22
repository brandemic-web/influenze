import type { APIRoute } from "astro";
import { getSiteSettings } from "../sanity/lib/queries";

export const prerender = false;

// Same content as Site Settings > AI & Search > llms.txt's initialValue —
// kept here too so the route still serves something sensible before that
// document exists, or if the field is ever left blank.
const FALLBACK = `# influenze.ai

> Search 450M+ creators across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals.

influenze.ai is a creator discovery and campaign platform: targeted search and filtering, creator analytics and media kits, verified contact details, side-by-side comparisons, shareable shortlists, and fraud/authenticity signals.

## Pages

- [Home](https://influenze.ai/): overview of the platform
- [Features](https://influenze.ai/features): discovery, analytics, contact unlocks, comparisons, shortlists
- [Pricing](https://influenze.ai/pricing): credit-based plans and what's included
- [Blog](https://influenze.ai/blog): research, benchmarks and product notes on creator discovery, audience measurement and campaign design
- [Terms of Service](https://influenze.ai/terms)
- [Privacy Policy](https://influenze.ai/privacy)
`;

// No draft-mode wiring here — crawlers only ever see published content, same
// as robots.txt.
export const GET: APIRoute = async () => {
	const { data: siteSettings } = await getSiteSettings();
	const body = siteSettings?.llmsTxt?.trim() || FALLBACK;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
