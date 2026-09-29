/** The one blog CTA: every inline CTA and the contents-rail CTA read this. */
import type { BlogCta } from "./blog";
import { APP_URL } from "./site";

export const BLOG_CTA: BlogCta = {
	heading: "Try Influenze.ai free",
	body: "Run one real brief through it and compare the shortlist against your own.",
	label: "Free trial",
	href: APP_URL,
	newTab: true,
};
