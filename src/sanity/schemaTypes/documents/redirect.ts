import { defineField, defineType } from "sanity";

/**
 * Not a singleton — one document per redirect. Read by src/middleware.ts on
 * every request (via a short-TTL cache), so a new entry takes effect without
 * a rebuild/deploy.
 */
export default defineType({
	name: "redirect",
	title: "Redirect",
	type: "document",
	fields: [
		defineField({
			name: "source",
			title: "From path",
			type: "string",
			description: 'A path on this site, e.g. "/old-page".',
			validation: (Rule) =>
				Rule.required().custom((value) =>
					!value || value.startsWith("/") ? true : 'Must start with "/".',
				),
		}),
		defineField({
			name: "destination",
			title: "To",
			type: "string",
			description: 'A path on this site (e.g. "/pricing") or a full URL (e.g. "https://…").',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "permanent",
			title: "Permanent (301)",
			type: "boolean",
			description: "Off sends a temporary 302 redirect instead.",
			initialValue: true,
		}),
		defineField({
			name: "enabled",
			title: "Enabled",
			type: "boolean",
			initialValue: true,
		}),
	],
	preview: {
		select: { source: "source", destination: "destination", enabled: "enabled" },
		prepare: ({ source, destination, enabled }) => ({
			title: `${source} → ${destination}`,
			subtitle: enabled ? undefined : "Disabled",
		}),
	},
});
