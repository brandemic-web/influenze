/** Site-wide identity, meta copy and outbound CTA destinations. */
export const SITE = {
	name: "influenze.ai",
	title: "Influenze.ai — Find and analyze the right creators",
	description:
		"Search 450M+ creators across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals.",
	domain: "influenze.ai",
} as const;

// Every "Free Trial" / "Login" CTA lands on the product app, which lives on the
// app. subdomain rather than this marketing site. The app routes a bare `/`
// with a query (GA's `?_gl=`) since IZ-203; before that it 404'd signed-in users.
// PR previews point at the dev app instead (PUBLIC_APP_URL in preview.yml).
export const APP_URL = import.meta.env.PUBLIC_APP_URL || "https://app.influenze.ai/";

/** Internal route for the features page — the "Learn More" destination. */
export const FEATURES_URL = "/features/";
