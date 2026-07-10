export interface Stat {
	value: string;
	label: string;
	description: string;
}

/** "99.8%" appears twice by design (see NOTES.md #7). */
export const STATS: Stat[] = [
	{
		value: "99.8%",
		label: "Fraud Detection accuracy",
		description:
			"We run every creator through 12+ fraud signals in real-time — fake followers, bot engagement pods, and suspicious growth spikes. At 99.8% accuracy, we catch what other platforms miss.",
	},
	{
		value: "50M+",
		label: "Creators Profile Indexed",
		description:
			"Our discovery goes deeper than hashtags and follower counts. We surface creators based on content themes, audience psychographics, and brand affinity signals — so you find the right fit.",
	},
	{
		value: "3hr+",
		label: "Avg. time saved per campaign",
		description:
			"Most teams stitch together a discovery tool, a spreadsheet, and their email inbox. We replaced all of that — lists, outreach, deal tracking, and CRM sync in one place.",
	},
	{
		value: "99.8%",
		label: "Historical data per creator",
		description:
			"Influenze.ai attributes revenue back to individual creators, calculates ROAS, and generates polished stakeholder reports in one click — backed by 24 months of historical data.",
	},
];
