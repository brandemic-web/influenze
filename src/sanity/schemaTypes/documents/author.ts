import { defineField, defineType } from "sanity";

/** A blog post author. Mirrors the local BlogAuthor shape it replaces:
 * name, role, avatar. */
export default defineType({
	name: "author",
	title: "Author",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "role",
			title: "Role / title",
			type: "string",
		}),
		defineField({
			name: "avatar",
			title: "Avatar",
			type: "image",
			options: { hotspot: true },
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { title: "name", subtitle: "role", media: "avatar" },
	},
});
