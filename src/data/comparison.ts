/**
 * "How Influenze Compares" — the competitor comparison table on the home page.
 *
 * Column order matches the design: the Influenze column sits second, between the
 * row labels and the three competitors, and is drawn as a raised card.
 *
 * Rows where the Influenze cell is a plain claim carry `text` only. Rows that
 * compare a capability carry `check: true` on our side and render a dash for
 * every competitor — the competitors' `text` then explains what they do instead.
 * `accent` is the leading fragment tinted brand-green (e.g. "450M+" Profiles).
 */

export interface ComparisonCell {
	/** Leading fragment rendered in brand green, before `text`. */
	accent?: string;
	text?: string;
	/** Render the capability tick (Influenze) or dash (competitors) above `text`. */
	mark?: boolean;
}

export interface ComparisonRow {
	label: string;
	influenze: ComparisonCell;
	/** One cell per COMPARISON_COMPETITORS entry, in the same order. */
	others: ComparisonCell[];
}

export const COMPARISON_HEADING = {
	lead: "How Influenze ",
	accent: "Compares",
};

export const COMPARISON_COMPETITORS = ["Qoruz", "Upfluence", "Culture X"];

export const COMPARISON_ROWS: ComparisonRow[] = [
	{
		label: "Primary Focus",
		influenze: { text: "Discovery & Talent Intelligence" },
		others: [
			{ text: "Discovery + Campaign ROI" },
			{ text: "Influencer + affiliate & commerce" },
			{ text: "Full lifecycle + social listening" },
		],
	},
	{
		label: "discovery database",
		influenze: { accent: "450M+", text: "Profiles" },
		others: [
			{ text: "300K+ profiles" },
			{ text: "9M+ profiles" },
			{ text: "200M+ profiles" },
		],
	},
	{
		label: "Platform coverage",
		influenze: { text: "IG · YT · TikTok" },
		others: [
			{ text: "IG · YT · X · FB" },
			{ text: "IG · TikTok · YT · X · Twitch" },
			{ text: "IG · YT · TikTok" },
		],
	},
	{
		label: "AI-driven search parameters",
		influenze: { mark: true, text: "AI parameter search in discovery" },
		others: [
			{ mark: true, text: "AI scoring, not search parameters" },
			{ mark: true, text: "AI co-pilot for outreach" },
			{ mark: true, text: "AI analytics & listening" },
		],
	},
	{
		label: "Public, transparent pricing",
		influenze: { mark: true, text: "credit-based" },
		others: [
			{ mark: true, text: "quote / contract" },
			{ mark: true, text: "quote only" },
			{ mark: true, text: "Demo" },
		],
	},
	{
		label: "Self-serve · no annual lock-in",
		influenze: { mark: true, text: "from Rs 1,000 / mo" },
		others: [
			{ mark: true, text: "annual" },
			{ mark: true, text: "12-mo + per-seat" },
			{ mark: true, text: "demo-led" },
		],
	},
	{
		// Marks only — the design clips this row's captions, leaving just the icons.
		label: "Usage-based credits + rollover",
		influenze: { mark: true },
		others: [{ mark: true }, { mark: true }, { mark: true }],
	},
	{
		label: "Best For",
		influenze: {
			text: "International campaigns, real-time discovery, shareable per campaign",
		},
		others: [
			{ text: "India brand campaigns" },
			{ text: "D2C / e-commerce" },
			{ text: "Lifecycle + listening" },
		],
	},
];
