/**
 * Dummy content for the sample blog route. Placeholder copy — the comparison
 * figures, quotes and author are invented and must not ship as-is.
 *
 * The body is a block list rather than a string so the renderer can put real
 * components (CTAs, tables, callouts) between runs of prose. `heading` blocks
 * carry the `id` the contents rail links to, so there is one list of sections
 * and both the rail and the body read it — see components/blog/BlogToc.astro.
 */
import type { BlogPost } from "../blog";
import heroImage from "../../assets/images/blog/placeholder_hero_c.webp";
import { BLOG_CTA } from "../blog-cta";

const post: BlogPost = {
	slug: "influenze-ai-vs-qoruz",
	category: "comparison",
	title: "Influenze.ai vs Qoruz",
	excerpt:
		"Two influencer marketing platforms built for the Indian market, judged on the things that actually decide a campaign: discovery depth, audience credibility, workflow and what a seat really costs.",
	// PLACEHOLDER art — a generated gradient, not the post's real image.
	hero: { src: heroImage, alt: "" },
	author: {
		name: "Ananya Rao",
		role: "Head of Creator Strategy",
		initials: "AR",
	},
	readMinutes: 11,
	publishedIso: "2026-09-14",

	body: [
		{
			type: "paragraph",
			html: "If you run creator campaigns out of India, your shortlist almost certainly has both of these names on it. <strong>Qoruz</strong> has been in the market the longest and most teams meet it first. <strong>Influenze.ai</strong> is the newer entrant, built around an AI research layer rather than a searchable list. They look similar on a pricing page and behave very differently once a live campaign is running.",
		},
		{
			type: "paragraph",
			html: "This piece is written for the person who has to defend the choice in a budget meeting. We go through discovery, audience credibility, campaign workflow, reporting, pricing and support — and we say plainly where each tool is the better answer.",
		},
		{
			type: "callout",
			title: "How to read this comparison",
			body: "We are the makers of Influenze.ai, so treat the verdicts as our argument rather than a neutral audit. Every number below is illustrative placeholder data for this sample page. Run both tools against ten creators you already know well — that test settles the question faster than any article.",
		},

		{ type: "heading", id: "quick-verdict", text: "The quick verdict" },
		{
			type: "paragraph",
			html: "If you brief a handful of large campaigns a year and mostly need a reliable contact database with managed support attached, Qoruz will serve you well and the learning curve is short.",
		},
		{
			type: "paragraph",
			html: "If your team runs continuous, always-on creator programmes — many small briefs, constant shortlisting, fraud screening before every payout — the research and automation layer in Influenze.ai is what changes the week-to-week workload. That is the split, and the rest of this article is the evidence for it.",
		},
		{
			type: "table",
			caption: "Placeholder figures for illustration only.",
			columns: ["", "Influenze.ai", "Qoruz"],
			rows: [
				["Creator profiles", "450M+ across 5 platforms", "~25M, India-weighted"],
				["Discovery method", "Natural-language AI research", "Filters and saved lists"],
				["Audience credibility", "Per-creator fraud score, free", "Add-on report, per credit"],
				["Median shortlist time", "Under 10 minutes", "2–3 hours"],
				["Pricing model", "Credit-based, pay for use", "Annual seat licence"],
				["Entry commitment", "Monthly, no lock-in", "12-month contract"],
			],
		},
		{ type: "cta", cta: BLOG_CTA },

		{ type: "heading", id: "discovery", text: "Creator discovery" },
		{
			type: "paragraph",
			html: "Discovery is where the two products diverge most, and it is worth being precise about the difference. Both let you find creators. They disagree about what you should have to know before you start.",
		},
		{ type: "subheading", text: "Qoruz: filters first" },
		{
			type: "paragraph",
			html: "Qoruz gives you a well-organised filter panel — platform, follower band, city, language, category, engagement rate. It is fast and predictable once you know exactly what you are looking for, and the India-specific category tagging is genuinely good. The cost is that you have to arrive with a hypothesis. A filter set can only return creators who match the box you already thought to tick.",
		},
		{ type: "subheading", text: "Influenze.ai: describe the brief" },
		{
			type: "paragraph",
			html: "Influenze.ai takes the brief in plain language — <em>“skincare creators in Tier 2 cities whose audience skews 18–24 female and who have not posted a competitor's product in six months”</em> — and returns a ranked shortlist with the reasoning attached. You are not translating a brief into filter values and hoping nothing is lost on the way.",
		},
		{
			type: "list",
			items: [
				"450M+ profiles across Instagram, YouTube, TikTok, X and LinkedIn, refreshed continuously.",
				"Look-alike search from any creator you already trust, including one outside the database.",
				"Competitor-collaboration history surfaced on the profile, not requested as a separate report.",
				"Exclusion rules that persist across campaigns, so a blocklist stays blocked.",
			],
		},
		{
			type: "quote",
			text: "We were spending the first two days of every campaign rebuilding the same shortlist from scratch. That is the part that disappeared.",
			attribution: "Placeholder quote — performance lead at a Bangalore agency",
		},

		{ type: "heading", id: "audience-quality", text: "Audience quality and fraud" },
		{
			type: "paragraph",
			html: "Follower counts are the least interesting number on a creator profile, and both platforms know it. The question is how much work it takes to get past it.",
		},
		{
			type: "paragraph",
			html: "Qoruz reports engagement rate on every profile and offers a deeper credibility report as a paid add-on. That is workable for a ten-creator campaign and expensive for a two-hundred-creator one, which is exactly when fraud screening matters most.",
		},
		{
			type: "paragraph",
			html: "Influenze.ai scores every profile in the database by default — bot concentration, engagement velocity against the creator's own baseline, comment authenticity, and follower-growth spikes that do not match posting activity. The score is on the card in the shortlist, so a suspicious account never reaches the brief.",
		},
		{
			type: "table",
			columns: ["Signal", "Influenze.ai", "Qoruz"],
			rows: [
				["Bot / inactive follower share", "Every profile", "Paid report"],
				["Engagement authenticity", "Every profile", "Paid report"],
				["Follower-growth anomalies", "Every profile", "Not available"],
				["Audience geography verification", "Every profile", "Every profile"],
				["Brand-safety content scan", "Every profile", "Manual review"],
			],
		},
		{ type: "cta", cta: BLOG_CTA },

		{ type: "heading", id: "workflow", text: "Campaign workflow" },
		{
			type: "paragraph",
			html: "A platform earns its licence fee in the boring middle of a campaign — outreach, follow-ups, contracts, approvals, payouts. Both tools cover this ground; they differ in how much stays inside the product.",
		},
		{
			type: "list",
			ordered: true,
			items: [
				"Shortlist and approval — both platforms support internal review, Influenze.ai adds a shareable client link with comments.",
				"Outreach — Qoruz provides contact details; Influenze.ai sends and tracks sequenced emails with reply detection.",
				"Negotiation and contracting — Qoruz is largely off-platform; Influenze.ai keeps rate cards, counters and e-signature in one thread.",
				"Content approval — both offer a review queue with versioned feedback.",
				"Payouts — Qoruz exports for finance; Influenze.ai handles milestone payouts with invoices generated per creator.",
			],
		},
		{
			type: "callout",
			title: "Where Qoruz is the better fit",
			body: "If your campaigns are run largely by a managed-service team rather than by your own marketers, the Qoruz model fits that shape well — their account support is well regarded and a lighter tool is less to maintain. Self-serve teams are the ones who feel the gaps.",
		},

		{ type: "heading", id: "reporting", text: "Reporting and measurement" },
		{
			type: "paragraph",
			html: "Qoruz reports reliably on the metrics the platforms expose — reach, impressions, engagements, cost per engagement — and exports cleanly to a deck. For most brand-awareness campaigns that is the whole requirement.",
		},
		{
			type: "paragraph",
			html: "Influenze.ai adds attribution on top: tracked links and codes per creator, conversion and revenue pulled back against spend, and a live dashboard your client can open instead of waiting for the weekly export. If your creator budget has to defend itself against performance channels, that distinction is the one that matters.",
		},
		{
			type: "quote",
			text: "Nobody in the room argues with reach numbers. They argue with whether reach did anything. We needed the second chart.",
			attribution: "Placeholder quote — marketing director, D2C brand",
		},

		{ type: "heading", id: "pricing", text: "What it actually costs" },
		{
			type: "paragraph",
			html: "Qoruz sells an annual seat licence, typically committed for twelve months, with credibility reports and some exports billed separately. It is predictable, and it is a real commitment before you have run a campaign.",
		},
		{
			type: "paragraph",
			html: "Influenze.ai is credit-based and monthly. Credits are consumed by the work you do — searches, exports, reports — so a quiet month costs less than a heavy one, and there is no annual lock-in to negotiate out of. Higher monthly spend earns a larger credit bonus rather than a discount you have to ask for.",
		},
		{
			type: "list",
			items: [
				"No per-seat charge — invite the whole team, including clients.",
				"Fraud scoring and audience data included rather than metered.",
				"Month-to-month, cancel whenever the programme pauses.",
				"Unused credits roll forward within the billing year.",
			],
		},
		{ type: "cta", cta: BLOG_CTA },

		{ type: "heading", id: "choosing", text: "So which one should you pick?" },
		{
			type: "paragraph",
			html: "Pick <strong>Qoruz</strong> if you want an established India-first database with strong managed support, your campaign volume is low and steady, and an annual commitment is not a problem for your finance team.",
		},
		{
			type: "paragraph",
			html: "Pick <strong>Influenze.ai</strong> if discovery is the bottleneck, if you screen for fraud at scale, if you need attribution rather than reach, or if you would rather pay for what you use than for seats you are not filling.",
		},
		{
			type: "paragraph",
			html: "The honest recommendation is to stop reading comparisons — including this one — and run the same brief through both. Ten minutes of real output tells you more than any table we can publish.",
		},
	],

	faq: {
		heading: "Questions about switching",
		subcopy:
			"Still weighing the two up? Write to us at info@dotme.in and we will answer honestly, including when the other tool is the better call.",
		items: [
			{
				question: "Can I import the creator lists I already built in Qoruz?",
				answer:
					"Yes. Export your lists as CSV and upload them during onboarding — handles are matched against the database and enriched with audience and credibility data automatically. Anything that cannot be matched is flagged rather than dropped silently.",
			},
			{
				question: "Is Influenze.ai's database really larger, or is that counting differently?",
				answer:
					"It is counted across five platforms — Instagram, YouTube, TikTok, X and LinkedIn — and includes creators from every market rather than India alone. For India-only Instagram campaigns the practical gap is smaller than the headline number suggests, which is why we recommend testing against creators you already know.",
			},
			{
				question: "Do I need an annual contract?",
				answer:
					"No. Plans are credit-based and billed monthly, and you can pause or cancel whenever a programme stops. Unused credits roll forward within the billing year rather than expiring at the end of each month.",
			},
			{
				question: "How is the audience credibility score calculated?",
				answer:
					"It combines bot and inactive follower concentration, engagement velocity measured against the creator's own baseline, comment authenticity, and follower-growth spikes that do not line up with posting activity. Every profile in the database carries a score by default rather than on request.",
			},
			{
				question: "What happens to a campaign that is already live elsewhere?",
				answer:
					"Mid-flight campaigns can be imported with their creators, deliverables and agreed rates so reporting stays continuous. Most teams run one campaign in parallel across both tools before moving the rest across.",
			},
			{
				question: "Does the platform handle creator payouts in India?",
				answer:
					"Yes — milestone-based payouts with invoices generated per creator, including GST handling for Indian creators. Finance teams get a single consolidated export rather than a file per campaign.",
			},
			{
				question: "Can clients see the campaign without a paid seat?",
				answer:
					"Yes. There is no per-seat charge, so clients and stakeholders can be invited to a live dashboard with view or comment access. What they see is scoped to the campaigns you share with them.",
			},
		],
	},
};

export default post;
