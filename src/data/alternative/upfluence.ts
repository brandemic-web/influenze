import { UPFLUENCE } from "../compare/upfluence";
import { TBC } from "./shared";
import type { AlternativeCompetitor } from "./types";

// The Figma frame's competitor. Its feature column is the compare page's, so the two
// pages can't disagree about Upfluence; the fit column is TBC in the design.
export const UPFLUENCE_ALTERNATIVE: AlternativeCompetitor = {
	slug: "upfluence",
	name: "Upfluence",
	draft: true,
	seo: {
		title: "Upfluence Alternative for Creator Discovery | Influenze.ai",
		description:
			"Looking for an Upfluence alternative? Discover and shortlist creators from 450M+ profiles with transparent credit pricing and no annual contracts.",
	},
	fit: {
		focusedDiscovery: { text: TBC },
		campaignOperations: { mark: true, text: TBC },
		pricingTransparency: { mark: true, text: TBC },
		commitment: { mark: true, text: TBC },
		bestFitIcp: { mark: true, text: TBC },
	},
	features: UPFLUENCE.features,
};
