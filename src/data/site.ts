/** Site-wide identity, meta copy and outbound CTA destinations. */
export const SITE = {
	name: "influenze.ai",
	title: "Influenze.ai — Find and analyze the right creators",
	description:
		"Search 450M+ creators across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals.",
	domain: "influenze.ai",
} as const;

// App entry points. TODO: point these at the real product app before launch —
// /login is not a route on this marketing site.
export const SIGNUP_URL = "https://influenze.ai/login";
export const LOGIN_URL = "https://influenze.ai/";

/** Internal route for the features page — the "Learn More" destination. */
export const FEATURES_URL = "/features";
