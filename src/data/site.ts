/** Site-wide identity, meta copy and outbound CTA destinations. */
export const SITE = {
	name: "influenze.ai",
	title: "Influenze.ai — Find and analyze the right creators",
	description:
		"Search 450M+ creators across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals.",
	domain: "influenze.ai",
} as const;

// Every "Free Trial" / "Login" CTA lands on the product app, which lives on the
// app. subdomain rather than this marketing site. /login, not /: GA's
// cross-domain `?_gl=` tag on the bare root 404s for signed-in users.
export const APP_URL = "https://app.influenze.ai/login";

/** Internal route for the features page — the "Learn More" destination. */
export const FEATURES_URL = "/features";
