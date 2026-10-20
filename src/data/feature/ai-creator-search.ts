import type { FeaturePage } from "./types";

// Copy from the "Influenze - LP" doc, Features LP. Anything not set here uses shared.ts.
export const AI_CREATOR_SEARCH: FeaturePage = {
	slug: "ai-search",
	name: "AI Creator Search",
	draft: true,
	seo: {
		title: "AI Creator Search and Discovery | Influenze.ai",
		description:
			"AI creator search and discovery across 450M+ Instagram, YouTube and TikTok profiles. Search from a real brief with semantic filters. Start with 500 credits.",
	},
	headings: {
		heroTitle: "*AI Creator Search* and Discovery\nThat Starts From a *Real Brief*",
		heroCta: "Run Your First AI Creator Search",
		heroBody:
			"AI creator search and discovery that works from your brief. Describe the creators you need (topic, audience, location, follower range) and Influenze.ai searches *450M+* profiles across Instagram, YouTube and TikTok using semantic and parameter-led discovery, so you start from relevant candidates instead of broad hashtags.",
		manualHeading: "Creator Discovery the Manual Way",
		manualBody:
			"Without AI creator search and discovery, finding creators becomes a manual process: searching one hashtag at a time, tracking saved posts in spreadsheets and circulating screenshots for approval.",
		howHeading: "How AI Creator Search\n*and Discovery Works*",
		numbersHeading: "What the *Numbers Mean* in AI Creator Discovery",
		freshnessHeading: "How *Fresh and Accurate*\nIs the AI Creator Search Data?",
		fastestLine1: "*AI Creator Search and Discovery:* The Fastest Way",
		fastestLine2: "*To Find and Evaluate the* Right Creators",
		whoForHeading: "Who Uses *AI Creator Search and Discovery?*",
	},
	howSteps: {
		search: {
			body: "Run an AI creator search across millions of profiles on Instagram, YouTube and TikTok with AI-driven filters.",
		},
		analyze: {
			body: "Know before you commit. Detailed reports break down audience, performance and brand fit for every creator your AI search surfaces.",
		},
		shortlist: {
			body: "Turn AI creator discovery results into lists and compare creators on the metrics that matter. Share, import and export with ease.",
		},
		reach: { body: "Unlock contact details for the creators you discover, across email, phone and WhatsApp." },
	},
	numbers: {
		topic: { body: "How closely a creator's content matches your search topic, not just their tags." },
		engagement: { body: "Interactions relative to audience size, benchmarked against similar creators." },
		affinity: {
			body: "Brands a creator has mentioned or worked with, so your AI creator search can surface brand-fit matches.",
		},
	},
	freshness: {
		updated: {
			title: "Updated Regularly",
			body: "Every profile in AI creator search and discovery is refreshed at least every 15 days, so profiles may change between updates.",
		},
		contact: {
			body: "Contact information is aggregated from publicly available sources. Deliverability and response rates are not guaranteed.",
		},
		pricing: {
			body: "Pricing is directional and intended as a benchmark, not a quote. Final rates vary based on deliverables and timelines.",
		},
	},
	whoForCards: [
		{
			title: "AGENCIES",
			body: "Uses AI creator search and discovery to turn client briefs into shortlists, evaluate profiles, compare creators and share lists for pitches.",
		},
		{
			title: "TALENT MANAGEMENT",
			body: "Aids in AI-led discovery of new talent, roster planning, creator categorisation, brand-fit mapping, profile evaluation, talent comparison, contact discovery and brand presentations.",
		},
		{
			title: "PUBLIC RELATIONS",
			body: "Assists in AI creator discovery, ambassador shortlisting, UGC partner discovery, product launch campaigns, regional creator identification, comparison and long-term creator pool building.",
		},
		{
			title: "ADVERTISING",
			body: "Assists in AI creator search for paid campaigns, ambassador shortlisting, regional creator identification and audience-fit comparison.",
		},
		{
			title: "E-COMMERCE",
			body: "Assists in AI creator discovery for UGC partners, product launch shortlists, regional creator identification and long-term creator pool building.",
		},
	],
	faqs: [
		{
			question: "What is AI creator search and discovery?",
			answer:
				"AI creator search and discovery lets you describe the creators you need, by topic, audience, location and follower range, and get matching profiles back. Influenze.ai uses semantic and parameter-led search across 450M+ profiles on Instagram, YouTube and TikTok.",
		},
		{
			question: "How is AI creator search different from hashtag search?",
			answer:
				"Hashtag search works one tag at a time. AI creator search matches the topic relevance of what creators actually post, along with bio phrases, location, follower range, engagement and lookalikes, so you start from relevant candidates.",
		},
		{
			question: "How accurate is the fraud detection?",
			answer:
				"Influenze.ai's multi-model AI checks every creator against 12+ fraud signals in real time, including fake follower percentage, engagement pods, comment quality, sudden follower growth spikes, audience demographic inconsistencies and giveaway-inflated metrics.",
		},
		{
			question: "How fresh is the creator data?",
			answer:
				"Creator data in Influenze.ai's AI creator search and discovery is refreshed at least every 15 days, so a profile may change between updates.",
		},
		{
			question: "How much does AI creator search and discovery cost?",
			answer:
				"Influenze.ai uses usage-based credits: 5 credits per direct search, 50 per profile analytics unlock and 5 per contact detail unlock, with rollover while you stay subscribed and no mandatory annual lock-in.",
		},
		{
			question: "Is there a free trial, and what's included?",
			answer:
				"Sign up with a work email and you get 500 credits, with no sales call required. That covers up to 100 AI creator searches, or a mix of searches, profile analytics unlocks and contact detail unlocks.",
		},
	],
};
