/** Every /for/<audience> page. Pages normally live in Sanity ("ICP Page"); a page here is a code fallback. */
import type { Faq } from "../faqs";
import type { BeforeAfterId, BriefId, CardText, IcpCopy, SlowsId, SmarterId } from "./shared";

export interface IcpPage {
	slug: string;
	name: string;
	draft: boolean;
	seo: { title: string; description: string };
	headings?: Partial<IcpCopy>;
	workflowPills?: string[];
	slows?: Partial<Record<SlowsId, Partial<CardText>>>;
	beforeAfter?: Partial<Record<BeforeAfterId, { before?: string; after?: string }>>;
	smarter?: Partial<Record<SmarterId, Partial<CardText>>>;
	briefs?: Partial<Record<BriefId, Partial<CardText> & { location?: string }>>;
	costLines?: string[];
	faqs?: Faq[];
}

export const ICP_PAGES: IcpPage[] = [
	{
		slug: "agencies",
		name: "Agencies",
		draft: true,
		seo: {
			title: "Creator Discovery Platform for Agencies | Influenze.ai",
			description:
				"The creator discovery platform for agencies: search 450M+ profiles, evaluate creators and share client-ready shortlists. Start with 500 credits, no lock-in.",
		},
		// Copy from the "Influenze - LP" doc, ICP LP. Anything not set here uses shared.ts.
		headings: {
			heroTitle: "The Creator Discovery Platform for Agencies:\n*Client-Ready Shortlists.* Zero Spreadsheets.",
			heroBody:
				"A creator discovery platform for agencies that turns every brief into a shortlist. Discover, evaluate and shortlist creators from *450M+* profiles, share lists and streamline client approvals.",
			workflowHeading: "A Creator Discovery Platform\nBuilt for *Agency Workflows*",
			slowsHeading: "What Slows Creator Discovery *for Agencies*",
			beforeAfterHeading: "Before and After a Creator Discovery\nPlatform for Agencies",
			beforeAfterSubcopy:
				"Not just another data platform. Influenze.ai verifies, scores and surfaces what matters to agency teams.",
			smarterHeading: "A Smarter Way for Agencies\n*to Discover Creators*",
			briefsHeading: "A Live Agency Brief, Start to Finish",
			costSubcopy:
				"Search, analyse the top candidates and unlock contacts for the final list, all inside one creator discovery platform for agencies.",
		},
		slows: {
			restarts: {
				body: "Without a creator discovery platform, agencies repeat the same manual searches, one client at a time.",
			},
			spreadsheets: { body: "Saved posts and old sheets drift out of date between client campaigns." },
		},
		beforeAfter: {
			spreadsheets: { after: "Reusable Lists Per Client Or Campaign" },
			network: { after: "Search Beyond Creators You Already Know" },
		},
		smarter: {
			discover: { body: "Turn every client brief into semantic and parameter-led creator search." },
			analyze: { body: "Check audience, engagement and growth before you recommend a creator." },
			share: { body: "Send clients a client-safe shortlist and unlock aggregated contacts." },
		},
		costLines: ["20 searches", "6 profiles analysed", "10 contacts unlocked"],
		faqs: [
			{
				question: "What is a creator discovery platform for agencies?",
				answer:
					"It's software that lets agency teams search, evaluate and shortlist creators for client briefs in one place. Influenze.ai is a creator discovery platform for agencies, with semantic and parameter-led search across 450M+ profiles on Instagram, YouTube and TikTok.",
			},
			{
				question: "How does Influenze.ai speed up client approvals?",
				answer:
					"Agencies keep lists per client, compare candidates side by side and send shareable, consistent shortlists instead of screenshots, so clients review the same evidence for every creator.",
			},
			{
				question: "How accurate is the fraud detection?",
				answer:
					"Influenze.ai's multi-model AI checks every creator against 12+ fraud signals in real time, including fake follower percentage, engagement pods, comment quality, sudden follower growth spikes, audience demographic inconsistencies and giveaway-inflated metrics.",
			},
			{
				question: "How many credits does one client brief use?",
				answer:
					"A typical brief of 20 searches, 6 profile analytics unlocks and 10 contact unlocks uses about 450 credits, which fits inside the 500 signup credits.",
			},
			{
				question: "Can my agency keep its existing creator network?",
				answer:
					"Yes. Import and export lists to keep the creators you already work with, then use lookalike and niche searches to find creators beyond your network.",
			},
			{
				question: "Is there a free trial, and what's included?",
				answer:
					"Sign up with a work email and you get 500 credits, with no sales call and no mandatory annual lock-in. That's enough to run a full client brief on the creator discovery platform for agencies before you choose a plan.",
			},
		],
	},
];

export const icpHref = (slug: string) => `/for/${slug}/`;

export * from "./shared";
