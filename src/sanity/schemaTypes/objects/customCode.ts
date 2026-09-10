import { defineField, defineType } from "sanity";

/**
 * Raw script/markup injection, reused both site-wide (siteSettings) and on
 * individual pages. Page-level code renders in addition to the site-wide
 * code, never instead of it — see Layout.astro.
 */
export default defineType({
	name: "customCode",
	title: "Custom Code",
	type: "object",
	fields: [
		defineField({
			name: "headerCode",
			title: "Header code",
			type: "text",
			rows: 6,
			description:
				"Raw HTML/JS pasted just before the page's </head> tag — analytics snippets, verification meta tags, chat-widget loaders, etc. Renders unescaped, so only paste code from a source you trust.",
		}),
		defineField({
			name: "footerCode",
			title: "Footer code",
			type: "text",
			rows: 6,
			description:
				"Raw HTML/JS pasted just before the page's closing </body> tag — the usual place for scripts that don't need to block rendering. Renders unescaped, so only paste code from a source you trust.",
		}),
	],
});
