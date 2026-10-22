import type { PlatformPage } from "./types";

// Copy from the "Influenze - LP" doc, Platform LP. The live page is a Sanity document;
// these fill any field left empty there, and anything not set here uses shared.ts.
export const INSTAGRAM: PlatformPage = {
	slug: "instagram",
	name: "Instagram",
	platform: "instagram",
	draft: true,
	seo: {
		title: "Instagram Influencer Search and Discovery | Influenze.ai",
		description:
			"Instagram influencer search and discovery by niche, location, follower tier and audience. Analyse Reels and audience fit before you shortlist. Start with 500 credits.",
	},
	headings: {
		searchByHeading: "What You Can *Search By* on {name}",
		freshnessHeading: "How *Fresh and Accurate*\nIs the {name} Data?",
	},
	howSteps: {
		search: {
			body: "Run an Instagram influencer search alongside YouTube and TikTok, using AI-driven filters across millions of creator profiles.",
		},
		analyze: {
			body: "Know before you commit. Detailed reports break down each Instagram influencer's audience, performance and brand fit.",
		},
		shortlist: {
			body: "Turn Instagram search results into lists and compare creators on the metrics that matter. Share, import and export with ease.",
		},
		reach: { body: "Unlock Instagram influencer contact details across email, phone and WhatsApp." },
	},
	mattersPoints: {
		engagement: {
			body: "Good Instagram influencer discovery looks at performance across recent content, not just a single viral Reel.",
		},
		platform: {
			body: "YouTube long-form views don't translate directly to Instagram performance. Each platform is evaluated on its own relevant metrics.",
		},
	},
	freshness: {
		updated: {
			title: "Updated Regularly",
			body: "Instagram influencer data is refreshed at least every 15 days, so profiles may change between updates.",
		},
		contact: {
			body: "Instagram influencer contact information is aggregated from publicly available sources. Deliverability and response rates are not guaranteed.",
		},
		pricing: {
			body: "Pricing is directional and intended as a benchmark, not a quote. Final rates vary based on deliverables and timelines.",
		},
	},
};
