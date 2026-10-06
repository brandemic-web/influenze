import { defineArrayMember, defineField, defineType } from "sanity";
import { HEAD_TO_HEAD_ROWS } from "../../../../data/landing";

/**
 * A competitor's side of the head-to-head table, written once and read by both its comparison
 * and its alternative page. Influenze.ai's side of each mandatory row is fixed in
 * data/landing.ts, so this document can only add the other column, never drop a row.
 */
export default defineType({
	name: "competitor",
	title: "Competitor",
	type: "document",
	groups: [
		{ name: "about", title: "About", default: true },
		{ name: "table", title: "Head-to-head" },
	],
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			group: "about",
			description: "As the competitor writes it, e.g. “Impulze.ai” — take care not to confuse it with Influenze.ai.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "website",
			title: "Official website",
			type: "url",
			group: "about",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "reviewedAt",
			title: "Facts reviewed on",
			type: "date",
			group: "about",
			options: { dateFormat: "D MMMM YYYY" },
			description: "When this column was last checked against the competitor's own site.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "positions",
			title: "Mandatory rows",
			type: "object",
			group: "table",
			description:
				"The competitor's position on each mandatory row. Cite their own page beside anything that can change.",
			fields: HEAD_TO_HEAD_ROWS.map((row) =>
				defineField({
					name: row.id,
					title: row.metric,
					type: "object",
					description: `Influenze.ai: ${row.influenze}`,
					options: { columns: 2 },
					fields: [
						defineField({ name: "value", title: "Their position", type: "string", validation: (Rule) => Rule.required() }),
						defineField({ name: "source", title: "Source URL", type: "url" }),
					],
				}),
			),
		}),
		defineField({
			name: "extraRows",
			title: "Supporting rows",
			type: "array",
			group: "table",
			description:
				"Optional rows below the mandatory ones — data refresh, contact-data status, list sharing, outreach, tracking, payments, integrations. Add them only when verified.",
			of: [
				defineArrayMember({
					type: "object",
					name: "competitorRow",
					fields: [
						defineField({ name: "metric", title: "Metric", type: "string", validation: (Rule) => Rule.required() }),
						defineField({ name: "influenze", title: "Influenze.ai", type: "string", validation: (Rule) => Rule.required() }),
						defineField({ name: "competitor", title: "Competitor", type: "string", validation: (Rule) => Rule.required() }),
						defineField({ name: "source", title: "Source URL", type: "url" }),
					],
					preview: { select: { title: "metric", subtitle: "competitor" } },
				}),
			],
		}),
	],
	preview: { select: { title: "name", subtitle: "website" } },
});
