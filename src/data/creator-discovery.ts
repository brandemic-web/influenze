import divoLogo from "../assets/images/common/logos_and_icons/divo_logo.png";
import hammerheadLogo from "../assets/images/home_page/trusted_by/hammerhead_logo.svg";
import hyperLogo from "../assets/images/home_page/trusted_by/hyper_logo.svg";
import { SIGNUP_CREDITS } from "./compare";
import type { ComparisonRow } from "./comparison";
import type { FeatureBlock } from "./featureBlocks";
import type { Faq } from "./faqs";
import type { HeaderNavigation } from "./nav";
import { CUSTOM_PLAN } from "./pricing";
import { APP_URL } from "./site";
import type { WhyInfluenzeStep } from "./whyInfluenze";

const signupButtonLabel = "Claim free credits";
const demoButtonLabel = "Request a demo";
const faqLink = { label: "FAQ", href: "#faq" };

export const CREATOR_DISCOVERY = {
	seo: {
		title: "Influencer Discovery Platform | 450M+ Creators | Influenze",
		description:
			"Find and vet creators across Instagram, YouTube and TikTok. Check follower quality, compare shortlists and start with 500 free credits.",
	},
	navigation: {
		logoHref: "#top",
		links: [
			{ label: "How it works", href: "#how" },
			{ label: "Features", href: "#features" },
			{ label: "Who it's for", href: "#who" },
			faqLink,
		],
		mobileLinks: [
			{
				label: "How it works",
				dropdown: [
					{ label: "Search", href: "#how-search" },
					{ label: "Vet", href: "#how-eye" },
					{ label: "Shortlist and share", href: "#how-rocket" },
				],
			},
			{
				label: "Features",
				dropdown: [
					{ label: "Creator discovery", href: "#feature-discovery" },
					{ label: "Audience analytics", href: "#feature-analytics" },
					{ label: "Shortlists and comparisons", href: "#feature-comparisons" },
					{ label: "Creator contact details", href: "#feature-contacts" },
				],
			},
			{
				label: "Who it's for",
				dropdown: [
					{ label: "Campaign teams", href: "#who" },
					{ label: "Testimonials", href: "#proof" },
				],
			},
			faqLink,
		],
		cta: { label: signupButtonLabel, href: "#start" },
		mobileStickyCta: { label: signupButtonLabel, href: APP_URL },
	} satisfies HeaderNavigation,
	metrics: {
		label: "Creator discovery metrics",
		items: [
			{ value: "450M+", label: "Creator profiles available to search" },
			{ value: "3", label: "Platforms: Instagram, YouTube and TikTok" },
			{ value: SIGNUP_CREDITS.toString(), label: "Free credits at signup, no card needed" },
			{ value: "100%", label: "Creator profiles vetted for follower quality" },
		],
	},
	hero: {
		eyebrow: "The world's largest creator search engine",
		title: "Find, vet and shortlist creators",
		accent: "in minutes.",
		previewLabel: "A walkthrough of finding, vetting and shortlisting creators in Influenze.ai.",
	},
	signup: {
		heading: "Find your next creator in minutes.",
		buttonLabel: signupButtonLabel,
		note: "Free credits don't expire and can be claimed by up to three people per company. No credit card required.",
	},
	demo: {
		label: demoButtonLabel,
		href: import.meta.env.PUBLIC_DEMO_URL?.trim() ||
			`mailto:${CUSTOM_PLAN.contactEmail}?subject=${encodeURIComponent(demoButtonLabel)}`,
	},
	comparison: {
		heading: "Creator research shouldn't live in *30 browser tabs.*",
		otherLabel: "The usual way",
		rows: [
			{
				label: "Creator discovery",
				influenze: { mark: true, text: "One search across three platforms and 450M+ profiles" },
				others: [{ mark: true, text: "Hashtag-hopping across three apps to find a handful of names" }],
			},
			{
				label: "Shortlist sharing",
				influenze: { mark: true, text: "Lists that stay live, shared through a view-only link" },
				others: [{ mark: true, text: "Spreadsheets that go stale before the client sees them" }],
			},
			{
				label: "Follower quality",
				influenze: { mark: true, text: "Follower-quality checks before any money moves" },
				others: [{ mark: true, text: "Follower counts that hide bots, pods and bought reach" }],
			},
			{
				label: "Contact details",
				influenze: { mark: true, text: "Email, phone and WhatsApp contacts, ready to export" },
				others: [{ mark: true, text: "Chasing contact details one DM at a time" }],
			},
		] satisfies ComparisonRow[],
	},
	workflow: {
		id: "how",
		eyebrow: "How it works",
		heading: { lead: "From search to shortlist", accent: "in three steps." },
		buttonHref: "#features",
		steps: [
			{
				icon: "search",
				title: "Search",
				description: "Filter by platform, follower tier, engagement rate, location, audience demographics, interests and hashtags. Like a creator already? Find their lookalikes.",
			},
			{
				icon: "eye",
				title: "Vet",
				description: "Open a creator's media kit to see follower quality, engagement, growth and estimated pricing per post before you reach out.",
			},
			{
				icon: "rocket",
				title: "Shortlist and share",
				description: "Save creators to lists and compare them side by side. Then share a view-only link that clients can open without an account, or export the list to CSV or Excel.",
			},
		] satisfies WhyInfluenzeStep[],
	},
	features: {
		heading: "Everything you need to *choose the right creator.*",
		cards: [
			{
				imageKey: "discovery",
				title: "Find creators who actually *fit your brand.*",
				description: "Search by what matters to the campaign: who a creator reaches, how that audience engages and where it lives. Lookalike search turns one good find into a longer list.",
				highlights: [
					"Platform, tier, engagement, location and hashtag filters",
					"Lookalikes from any creator you already like",
					"Audience age, gender, location and interests",
					"Interest and brand-affinity filters",
				],
				ctaLabel: "Start searching free",
			},
			{
				imageKey: "analytics",
				title: "See who's *really listening.*",
				description: "Every report splits followers into real, mass, influencer and suspicious accounts. A daily audit flags inflated counts and engagement pods, and estimated pricing helps you set a budget before you negotiate.",
				highlights: [
					"Real, mass, influencer and suspicious follower split",
					"Daily checks for inflated counts and engagement pods",
					"Follower growth and engagement history",
					"Estimated pricing for reels, stories, posts and carousels",
				],
				ctaLabel: "Audit a creator free",
			},
			{
				imageKey: "comparisons",
				title: "Every shortlist, *ready for the client.*",
				description: "Build a list for each campaign, compare creators side by side and share it through a view-only link that clients open without signing up. Import lists you already have, assign owners and manage them in bulk.",
				highlights: [
					"A list for every campaign or client",
					"Side-by-side reach, engagement and follower quality",
					"View-only links clients can open without an account",
					"List ownership and bulk management",
				],
				ctaLabel: "Build your first list",
			},
			{
				imageKey: "contacts",
				title: "From shortlist *to first message.*",
				description: "Unlock verified contact details by email, phone and WhatsApp, then export the list to CSV or Excel for your outreach sheet or CRM.",
				highlights: [
					"CSV and Excel export",
					"Verified email, phone and WhatsApp contacts",
					"Full media kits unlocked from your lists",
				],
				ctaLabel: "Get contacts free",
			},
		] satisfies FeatureBlock[],
	},
	audience: [
		{
			title: "Influencer and gaming agencies",
			description: "Build client-ready creator rosters in an afternoon. Keep your picks in one shortlist and send clients a single view-only link they can open without an account.",
			href: "/icp/agencies/",
		},
		{
			title: "PR firms",
			description: "Find creators your audience already trusts, then check their reach before you pitch. Build your pitch list around the voices most relevant to your story.",
			href: "/icp/pr-agencies/",
		},
		{
			title: "Performance marketers",
			description: "Compare engagement and follower quality before picking creators. Spend your budget on partnerships with audiences that actually pay attention.",
			href: "/icp/performance-marketing-teams/",
		},
		{
			title: "E-commerce and app brands",
			description: "Match each product to creators who reach your target customers. Compare audience location, age and interests before building your shortlist.",
			href: "/icp/consumer-brands/",
		},
		{
			title: "In-house social teams",
			description: "Swap scattered spreadsheets for shared lists the whole team can see.",
			href: "/icp/in-house-social-teams/",
		},
		{
			title: "Talent managers",
			description: "Spot rising creators early and back every brand pitch with clean audience data.",
			href: "/icp/talent-managers/",
		},
	],
	proof: {
		heading: "Teams already use Influenze *to find creators faster.*",
		testimonials: [
			{
				company: "Hyper",
				logo: hyperLogo,
				monochromeLogo: false,
				statement: "Scout creators beyond India with one discovery tool.",
				quote: "We'd tried a few discovery tools before Influenze. It's the one we kept, mostly because the data goes well beyond India, so we can scout creators for any market.",
			},
			{
				company: "Hammerhead Global",
				logo: hammerheadLogo,
				monochromeLogo: false,
				statement: "Vet creators faster with pricing and audience quality.",
				quote: "Working out what a creator should cost used to be guesswork. Influenze shows us pricing and audience quality together, which makes vetting much quicker.",
			},
			{
				company: "Divo",
				logo: divoLogo,
				monochromeLogo: true,
				statement: "Go from a campaign brief to a creator shortlist.",
				quote: "Influenze makes finding influencers easy. We go from a brief to a shortlist without the usual digging.",
			},
		],
	},
	faq: {
		heading: "Questions, answered.",
		items: [
			{
				question: "Which platforms does Influenze cover?",
				answer: "Instagram, YouTube and TikTok, all searchable from one place.",
			},
			{
				question: "What is an influencer discovery platform?",
				answer: "It's a tool for finding creators by audience, niche and performance, so you're not scrolling hashtags to build a list. Influenze adds vetting and shortlisting on top, which means you can check a creator's follower quality and share the shortlist from the same place.",
			},
			{
				question: "How do credits work?",
				answer: "Credits are usage-based. Adding a creator to a list unlocks their full media kit for 50 credits, and creators you've already unlocked don't cost you again. New accounts get 500 free credits that don't expire.",
			},
			{
				question: "Do I need a credit card to start?",
				answer: "No. Sign up with your work email and the 500 credits are yours. Up to three people from the same company can claim them.",
			},
			{
				question: "How does Influenze vet influencers?",
				answer: "Each creator report breaks followers into real, mass, influencer and suspicious accounts, alongside engagement, follower growth and brand affinities. A daily audit looks for inflated follower counts and engagement pods, so the numbers you compare reflect real reach.",
			},
			{
				question: "Can I find micro-influencers or creators in a specific niche?",
				answer: "Yes. Filter by follower tier to focus on nano and micro creators, then narrow by interest, hashtag, location or brand affinity. Finding tech, gaming, beauty or finance creators works the same way.",
			},
			{
				question: "How often is creator data updated?",
				answer: "Profiles refresh a couple of times a month, and the most active creators are updated most often.",
			},
			{
				question: "Can I share results with clients?",
				answer: "Yes. Send a view-only link to clients or teammates. They can open it without creating an account.",
			},
			{
				question: "Can I export creator lists and contact details?",
				answer: "Yes. Export any list to CSV or Excel, including verified email, phone and WhatsApp contacts where available.",
			},
			{
				question: "Does Influenze use AI?",
				answer: "Yes. AI drives search and lookalike matching, surfacing creators whose audience and content resemble the ones you're looking for.",
			},
			{
				question: "Is Influenze an agency?",
				answer: "No. Influenze is the research tool agencies and in-house teams use before a campaign, covering discovery, vetting, shortlisting and contact details. Running the campaign stays with you.",
			},
		] satisfies Faq[],
	},
} as const;
