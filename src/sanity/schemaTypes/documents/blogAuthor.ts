import { defineField, defineType } from "sanity";

/**
 * A byline. Its own document rather than fields on the post, so one author can
 * be corrected once and every post they wrote follows.
 */
export default defineType({
	name: "blogAuthor",
	title: "Blog Author",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "name", maxLength: 96 },
			description:
				"The author page's address: /author/<slug>. Click Generate to take it from the name. Changing it breaks existing links.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "string",
			description: 'Shown under the name, e.g. "Head of Creator Strategy".',
		}),
		defineField({
			name: "initials",
			title: "Initials",
			type: "string",
			description:
				"Two letters for the avatar disc, used when there is no portrait. Left blank, they are taken from the name.",
			validation: (Rule) => Rule.max(2).warning("The disc only has room for two letters."),
		}),
		defineField({
			name: "avatar",
			title: "Portrait",
			type: "image",
			description: "Optional. Replaces the initials disc on the byline.",
			options: { hotspot: true },
		}),
		defineField({
			name: "bio",
			title: "Bio",
			type: "text",
			rows: 3,
			description: "Optional. A short paragraph under the name on the author page.",
		}),
	],
	preview: {
		select: { title: "name", subtitle: "role", media: "avatar" },
	},
});
