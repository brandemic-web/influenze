import { defineField, defineType } from "sanity";

/**
 * Raw header/footer script slots. Dropped into siteSettings (site-wide) and
 * into each page document (per-page, appended after the site-wide ones) —
 * see Layout.astro's headerScripts/footerScripts props.
 */
export default defineType({
	name: "customScripts",
	title: "Custom scripts",
	type: "object",
	fields: [
		defineField({
			name: "header",
			title: "Header scripts",
			type: "text",
			rows: 6,
			description: "Raw HTML/script, injected near the end of <head>.",
		}),
		defineField({
			name: "footer",
			title: "Footer scripts",
			type: "text",
			rows: 6,
			description: "Raw HTML/script, injected just before </body>.",
		}),
	],
});
