import { SIGNUP_CREDITS, TBC } from "./shared";
import type { Competitor } from "./types";

// Cells marked "as on the homepage" repeat Upfluence's column in data/comparison.ts;
// the rest are TBC in the design and need sourcing from upfluence.com.
export const UPFLUENCE: Competitor = {
	slug: "upfluence",
	name: "Upfluence",
	draft: true,
	seo: {
		title: "Influenze.ai vs Upfluence — Which Creator Discovery Platform Fits?",
		description:
			"Influenze.ai offers flexible creator discovery without annual contracts. Upfluence handles outreach, commerce and payments. Compare features, pricing and workflow.",
	},
	intro:
		"Influenze.ai offers flexible creator discovery without annual contracts. Upfluence handles outreach, commerce and payments. Choose based on your campaign workflow.",
	chooseInfluenze: [
		"Creator discovery, evaluation and shortlisting",
		`Getting started with ${SIGNUP_CREDITS} self-serve credits`,
		"Keeping existing outreach and payment tools",
		"Visible credit costs before talking to sales",
	],
	chooseCompetitor: [
		"You want outreach, commerce and payments in one suite",
		// Shown as drawn; drop the second line once the claim is checked.
		"You are ready for an annual commitment\n(VERIFY on upfluence.com before publishing)",
		"One vendor for the whole campaign lifecycle matters most",
	],
	features: {
		primaryFocus: { text: "End-to-end influencer marketing and\ncommerce suite" },
		database: { text: "9M+ profiles" }, // as on the homepage
		platforms: { text: "IG · TikTok · YT · X · Twitch" }, // as on the homepage
		aiSearch: { mark: true, text: "AI co-pilot for outreach" }, // as on the homepage
		publicPricing: { mark: true, text: "Quote only" }, // as on the homepage
		selfServe: { mark: true, text: "12-mo + per-seat" }, // as on the homepage
		credits: { mark: true, text: TBC },
		bestFor: { mark: true, text: "D2C / e-commerce" }, // as on the homepage
		outreach: { mark: true, text: TBC },
	},
	pricing: {
		model: { text: TBC },
		creditsPerAction: { text: TBC },
		entryPath: { mark: true, text: TBC },
		publicPricing: { mark: true, text: TBC },
		commitment: { mark: true, text: TBC },
		salesCall: { mark: true, text: TBC },
		whoBenefits: { mark: true, text: TBC },
	},
	workflow: {
		search: TBC,
		analyze: TBC,
		shortlist: TBC,
		share: TBC,
		outreach: TBC,
		tracking: TBC,
	},
};
