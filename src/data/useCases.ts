export interface UseCase {
	title: string;
	description: string;
}

/**
 * ADVERTISING and E-COMMERCE intentionally repeat the PUBLIC RELATIONS copy —
 * that's what the design contains (see NOTES.md #6).
 */
export const USE_CASES: UseCase[] = [
	{
		title: "INFLUENCER MARKETING",
		description:
			"Facilitates campaign-wise creator discovery, influencer list building, media kit analytics, real-time comparisons, contact access, shortlisting, sharing, and client recommendations.",
	},
	{
		title: "TALENT MANAGEMENT",
		description:
			"Aids in new talent discovery, roster planning, creator categorization, brand-fit mapping, profile evaluation, talent comparison, contact discovery, and brand presentations.",
	},
	{
		title: "PUBLIC RELATIONS",
		description:
			"Assists in creator discovery, ambassador shortlisting, UGC partner discovery, product launch campaigns, regional creator identification, comparison, and long-term creator pool building.",
	},
	{
		title: "ADVERTISING",
		description:
			"Assists in creator discovery, ambassador shortlisting, UGC partner discovery, product launch campaigns, regional creator identification, comparison, and long-term creator pool building.",
	},
	{
		title: "E-COMMERCE",
		description:
			"Assists in creator discovery, ambassador shortlisting, UGC partner discovery, product launch campaigns, regional creator identification, comparison, and long-term creator pool building.",
	},
];
