/**
 * Central site config. The app CTA URLs below are placeholders — swap for the
 * real app URLs when they exist (see NOTES.md #4). Internal page routes are
 * real and kept here so a route change is a one-line edit.
 */
export const SITE = {
	name: "influenze.ai",
	title: "Influenze.ai — Find and analyze the right creators",
	description:
		"Search 450M+ creators across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals.",
	domain: "influenze.ai",
} as const;

export const SIGNUP_URL = "https://influenze.ai/login";
export const LOGIN_URL = "https://influenze.ai/";
export const CONTACT_URL = "#";

/** Internal route for the features page — the "Learn More" destination. */
export const FEATURES_URL = "/features";
