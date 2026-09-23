import { defineField, defineType } from "sanity";

/**
 * Singleton — the /blog listing page. Holds the heading, the empty-state wording
 * and which post gets the featured card. The posts and the filter rail are not
 * here: they come from the blogPost and blogCategory documents themselves.
 *
 * The featured post stays in the grid below as well, so filtering to its
 * category lands on the post rather than an empty state.
 */
export default defineType({
	name: "blogIndex",
	title: "Blog Index",
	type: "document",
	fields: [
		defineField({ name: "seo", title: "SEO", type: "seo" }),
		defineField({
			name: "scripts",
			title: "Page scripts",
			type: "customScripts",
			description: "Injected after the site-wide global scripts, only on this page.",
		}),
		defineField({
			name: "title",
			title: "Heading",
			type: "string",
			description: "The page's H1.",
			initialValue: "Blogs",
		}),
		defineField({
			name: "sub",
			title: "Sub-heading",
			type: "text",
			rows: 2,
			description: "One line under the heading — it is centred and set to run to about two lines.",
		}),
		defineField({
			name: "featuredPost",
			title: "Featured post",
			type: "reference",
			to: [{ type: "blogPost" }],
			description: "Gets the large card at the top. Left blank, the newest post is used.",
		}),
		defineField({
			name: "featuredLabel",
			title: "Featured badge",
			type: "string",
			initialValue: "Featured",
		}),
		defineField({
			name: "listingHeading",
			title: "Listing heading",
			type: "string",
			description: "The heading above the filter rail and the grid.",
			initialValue: "All articles",
		}),
		defineField({
			name: "emptyTitle",
			title: "Empty state — heading",
			type: "string",
			description: "Shown when a category has no posts in it yet.",
			initialValue: "Nothing here yet",
		}),
		defineField({
			name: "emptyBody",
			title: "Empty state — body",
			type: "text",
			rows: 2,
		}),
	],
	preview: {
		prepare: () => ({ title: "Blog Index" }),
	},
});
