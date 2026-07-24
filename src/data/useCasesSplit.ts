export interface UseCaseColumn {
	title: string;
	points: string[];
}

export const USE_CASES_SPLIT: UseCaseColumn[] = [
	{
		title: "For Brands",
		points: [
			"Launch products with creators your audience already trusts",
			"Find creators that match your brand",
			"Reach new markets faster",
			"Measure campaign performance with real data",
		],
	},
	{
		title: "For Agencies",
		points: [
			"Build creator lists in minutes",
			"Create data-backed creator recommendations",
			"Manage campaigns at scale with organized creator lists",
			"Track performance across every campaign",
		],
	},
];
