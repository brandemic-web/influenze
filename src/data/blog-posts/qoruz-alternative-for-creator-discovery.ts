/**
 * "Qoruz Alternative for Creator Discovery" — the featured post on /blog.
 *
 * Positioning copy about a named competitor, so the claims about Qoruz are kept
 * qualitative on purpose: what a database-and-filters product can and cannot do
 * by design, not invented pricing, headcount or coverage numbers. Anything
 * specific about Qoruz added later needs a citable source, and the whole blog
 * stays `noindex` until this copy has sign-off — see BLOG_NOINDEX in data/blog.ts.
 */
import type { BlogPost } from "../blog";
import heroImage from "../../assets/images/blog/placeholder_hero_b.webp";
import { BLOG_CTA } from "../blog-cta";

const post: BlogPost = {
	slug: "qoruz-alternative-for-creator-discovery",
	category: "alternative",
	title: "Qoruz Alternative for Creator Discovery",
	excerpt:
		"If Qoruz has become the place your team goes to look creators up rather than to find them, here is what to judge an alternative on — and an honest account of where Influenze.ai is the better answer and where it is not.",
	// PLACEHOLDER art — a generated gradient, not the post's real image.
	hero: { src: heroImage, alt: "" },
	author: {
		name: "Influenze.ai Editorial",
		role: "Creator marketing research",
		initials: "IN",
	},
	readMinutes: 9,
	publishedIso: "2026-09-23",

	body: [
		{
			type: "paragraph",
			html: "Most teams do not go looking for a Qoruz alternative because the product broke. They go looking because the work changed. A brand that briefed four campaigns a year now runs something closer to forty, the shortlist is rebuilt every fortnight, and the tool that was bought as a creator database is being asked to behave like a research assistant.",
		},
		{
			type: "paragraph",
			html: "This page is about that specific gap — <strong>creator discovery</strong> — rather than a feature-by-feature audit. We cover what actually slows discovery down, what to test any alternative against, and where <strong>Influenze.ai</strong> fits. We also say where staying put is the right call.",
		},
		{
			type: "callout",
			title: "Whose argument this is",
			body: "We build Influenze.ai, so read this as our case rather than a neutral review. The fair test is your own: take ten creators you already know are right for your brand, and see which tool surfaces them from a brief that never names them.",
		},

		{ type: "heading", id: "why-teams-switch", text: "Why teams start looking" },
		{
			type: "paragraph",
			html: "Qoruz is an established, India-first influencer platform, and the reason it is usually the first tool a team meets is that it does the obvious thing well: a large, well-tagged creator database with a filter panel over it. If you already know the shape of the creator you want, that is a fast way to get a list.",
		},
		{
			type: "paragraph",
			html: "The friction shows up at a different moment. A filter panel can only return creators who match a box someone thought to tick. That makes it excellent at <em>looking creators up</em> and structurally weaker at <em>finding creators you had not considered</em> — which is the part of discovery that decides whether a campaign is interesting or a rerun of the last one.",
		},
		{
			type: "list",
			items: [
				"The brief arrives in sentences and has to be translated into filter values, and the nuance is what gets lost in the translation.",
				"Shortlists drift back toward the same familiar names, because those are the names the filters were built around.",
				"Credibility checks happen at the end, after the list has already been shared, when removing someone is awkward.",
				"Every new campaign restarts the same manual process rather than building on the last one.",
			],
		},

		{ type: "heading", id: "what-to-judge", text: "What to judge an alternative on" },
		{
			type: "paragraph",
			html: "Platform comparison pages tend to compete on database size, which is the least decisive number available — nobody reviews forty million profiles. These are the four questions that actually separate discovery tools in practice.",
		},
		{ type: "subheading", text: "1. Can it take the brief as written?" },
		{
			type: "paragraph",
			html: "The real input is a sentence: <em>“skincare creators in Tier 2 cities whose audience skews 18–24 female and who haven't posted a competitor's product in six months.”</em> If the tool needs that decomposed into six filters before it can help, you are doing the reasoning and it is doing the retrieval.",
		},
		{ type: "subheading", text: "2. Does credibility come before the shortlist?" },
		{
			type: "paragraph",
			html: "Audience quality checks that are a paid add-on or a separate report get run on the final ten, not the initial two hundred — which is exactly backwards. Fraud screening only changes decisions if it is present while you are still deciding.",
		},
		{ type: "subheading", text: "3. Does it explain itself?" },
		{
			type: "paragraph",
			html: "A ranked list with no reasoning attached cannot be argued with, and therefore cannot be corrected. Discovery you can interrogate — why this creator, what in their audience matched — is the difference between a tool your team trusts and one they check by hand anyway.",
		},
		{ type: "subheading", text: "4. What does it cost to try?" },
		{
			type: "paragraph",
			html: "Annual seat licences are a reasonable model and a real commitment. If you cannot run one genuine brief through a tool before signing, you are buying on a demo rather than on evidence.",
		},
		{ type: "cta", cta: BLOG_CTA },

		{ type: "heading", id: "how-influenze-differs", text: "How Influenze.ai approaches discovery" },
		{
			type: "paragraph",
			html: "Influenze.ai is built the other way round from a filter panel. You describe the campaign in plain language and an AI research layer works across the creator graph — content, audience composition, brand history, credibility signals — and returns a ranked shortlist with the reasoning attached to each name.",
		},
		{
			type: "list",
			items: [
				"450M+ creator profiles across Instagram, YouTube, TikTok, X and LinkedIn, rather than one platform deeply and the rest thinly.",
				"Natural-language briefs, so the nuance in the brief survives into the search.",
				"Look-alike search from any creator you already trust — including one who is not in the database yet.",
				"Audience credibility scored on every profile by default, visible on the card while you are still shortlisting.",
				"Exclusion rules that persist between campaigns, so a blocklist stays blocked without being re-applied.",
			],
		},
		{
			type: "table",
			caption:
				"A description of the two design approaches, not a benchmark — verify anything here against both products before you quote it.",
			columns: ["Discovery question", "Filter-and-database tools", "Influenze.ai"],
			rows: [
				["Starting point", "A hypothesis you already hold", "The brief as written"],
				["Finds creators you had not considered", "Only if a filter happens to catch them", "Yes — that is the search's job"],
				["Reasoning behind a result", "Implicit in the filter set", "Attached to each creator"],
				["Credibility screening", "Typically a separate or paid report", "On every profile, before the shortlist"],
				["Cross-platform coverage", "Usually strongest on one platform", "Five platforms in one search"],
			],
		},

		{ type: "heading", id: "credibility", text: "Discovery that already knows who is fake" },
		{
			type: "paragraph",
			html: "Inflated audiences are not an edge case in creator marketing; they are a background condition. The question is whether your tool makes you pay — in money or in steps — to find out.",
		},
		{
			type: "paragraph",
			html: "Every profile in Influenze.ai carries a credibility score computed from bot and inactive follower concentration, engagement velocity measured against that creator's own baseline, comment authenticity, and follower growth that does not line up with posting activity. Because the score is already on the card, a suspect account is filtered out during discovery rather than caught in a review at the end.",
		},
		{ type: "cta", cta: BLOG_CTA },

		{ type: "heading", id: "switching", text: "Switching without losing what you built" },
		{
			type: "paragraph",
			html: "The cost of leaving a platform is rarely the software — it is the lists, the relationships and the reporting history a team has accumulated inside it. That work moves.",
		},
		{
			type: "list",
			ordered: true,
			items: [
				"Export your existing lists as CSV and upload them — handles are matched against the database and enriched with audience and credibility data, and anything unmatched is flagged rather than dropped quietly.",
				"Import live campaigns with their creators, deliverables and agreed rates, so reporting stays continuous across the move.",
				"Run the next brief in both tools in parallel and compare the two shortlists before you commit anything else.",
				"Move the rest once the parallel run has settled the question — there is no annual contract to time the switch around.",
			],
		},
		{
			type: "callout",
			title: "When staying with Qoruz is the right call",
			body: "If your campaigns are run largely by a managed-service team rather than your own marketers, if your volume is low and steady, and if the creators you work with are already known to you, then discovery is not your bottleneck — and a switch buys you very little. The teams who feel the difference are the ones shortlisting continuously and self-serve.",
		},

		{ type: "heading", id: "pricing", text: "What it costs to move" },
		{
			type: "paragraph",
			html: "Influenze.ai is credit-based and billed monthly. Credits are consumed by the work you actually do — searches, reports, exports — so a quiet month costs less than a heavy one, and there is no annual commitment to negotiate your way out of if the programme pauses.",
		},
		{
			type: "list",
			items: [
				"No per-seat charge, so the whole team and your clients can be in the tool.",
				"Credibility and audience data included rather than metered separately.",
				"Month to month — pause or cancel when a programme stops.",
				"Unused credits roll forward within the billing year.",
			],
		},

		{ type: "heading", id: "verdict", text: "Is it the right alternative for you?" },
		{
			type: "paragraph",
			html: "Choose an alternative if discovery is where your weeks go: if the shortlist is rebuilt constantly, if the same familiar names keep resurfacing, if fraud screening happens too late to change anything, or if you need more than one platform in a single search.",
		},
		{
			type: "paragraph",
			html: "Stay where you are if the database is doing what you need, your campaign volume is steady, and managed support matters more to you than search depth. That is a legitimate answer and we would rather you reach it honestly than switch and regret it.",
		},
		{
			type: "paragraph",
			html: "Either way, do not settle this from a comparison page — including ours. One real brief, run through both, will tell you more in ten minutes than any table we can publish.",
		},
		{ type: "cta", cta: BLOG_CTA },
	],

	faq: {
		heading: "Questions about moving from Qoruz",
		subcopy:
			"Weighing up a switch? Write to us at info@dotme.in — we will answer straight, including when staying put is the better call.",
		items: [
			{
				question: "Can I bring the creator lists I built in Qoruz with me?",
				answer:
					"Yes. Export them as CSV and upload them during onboarding. Handles are matched against the database and enriched with audience and credibility data automatically, and anything that cannot be matched is flagged rather than dropped silently.",
			},
			{
				question: "Is Influenze.ai an India-first platform?",
				answer:
					"India is a core market and the data is strong there, but the database spans every market and five platforms — Instagram, YouTube, TikTok, X and LinkedIn. If your campaigns are India-only Instagram, the practical coverage gap against an India-specialist tool is narrower than headline profile counts suggest, which is why we recommend testing against creators you already know well.",
			},
			{
				question: "How is this different from just having better filters?",
				answer:
					"Filters return creators who match a box you thought to tick. The research layer works from the brief itself, so it can surface creators you would not have described in advance — and it attaches the reasoning to each result, so you can correct it rather than trust it blindly.",
			},
			{
				question: "Do I have to sign an annual contract to try it?",
				answer:
					"No. Plans are credit-based and billed monthly, and there is a free start with no card required. Most teams run one brief in parallel with their existing tool before moving anything else across.",
			},
			{
				question: "What happens to campaigns that are already live?",
				answer:
					"They can be imported with their creators, deliverables and agreed rates so reporting stays continuous. You do not have to wait for a clean break between campaigns to start.",
			},
			{
				question: "Will my clients need paid seats to see the work?",
				answer:
					"No. There is no per-seat charge, so clients and stakeholders can be invited to a live dashboard with view or comment access, scoped to the campaigns you choose to share.",
			},
		],
	},
};

export default post;
