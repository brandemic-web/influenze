/**
 * The one CTA the blog uses. Every inline CTA in every post, and the standing
 * CTA in the contents rail, reads this — same treatment, same words, so a post
 * never escalates through a set of different-looking boxes.
 *
 * It lives in its own module rather than in `data/blog.ts` because the post
 * files import it and `data/blog.ts` imports the post files: keeping the value
 * here means that cycle stays type-only, and types are erased at build.
 */
import type { BlogCta } from "./blog";
import { APP_URL } from "./site";

export const BLOG_CTA: BlogCta = {
	heading: "Try Influenze.ai free",
	body: "Run one real brief through it and compare the shortlist against your own.",
	label: "Free trial",
	href: APP_URL,
	newTab: true,
};
