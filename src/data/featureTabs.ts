export interface FeatureTab {
	id: string;
	label: string;
}

export const FEATURE_TABS_HEADING = "Features that you get hooked to";

/**
 * Only the "Discover & Analyze" tab state is designed in Figma; the panel
 * copy below is shared and tabs swap the right-side visual (see NOTES.md).
 */
export const FEATURE_TABS: FeatureTab[] = [
	{ id: "discover", label: "Discover & Analyze" },
	{ id: "lists", label: "My Lists" },
	{ id: "share", label: "Share" },
];

export const FEATURE_TABS_PANEL = {
	heading: "Find high-performing creators using intelligent discovery and analytics",
	points: [
		"Search creators by niche, platform, region, audience, content style, engagement, and more.",
		"Access detailed media kits with audience demographics, performance metrics and content analytics",
	],
	buttonLabel: "Learn More",
};
