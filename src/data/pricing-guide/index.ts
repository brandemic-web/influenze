/**
 * Every /pricing/<slug> guide. Guides normally live in Sanity ("Pricing Guide Page");
 * a page here is a code fallback. /pricing itself is the separate pricing page.
 */
import type { Faq } from "../faqs";
import type { CreditRow, PricingGuideCopy, QuoteRowId } from "./shared";

export interface PricingGuidePage {
	slug: string;
	name: string;
	draft: boolean;
	seo: { title: string; description: string };
	headings?: Partial<PricingGuideCopy>;
	creditRows?: CreditRow[];
	quote?: Partial<Record<QuoteRowId, { label?: string; ours?: string; theirs?: string }>>;
	faqs?: Faq[];
}

export const PRICING_GUIDES: PricingGuidePage[] = [
	{
		slug: "credits",
		name: "How Credits Work",
		draft: true,
		seo: {
			title: "Influenze.ai Pricing: Plans, Credits and Costs",
			description:
				"Influenze.ai pricing explained: per-action credit costs, plans from Starter to Enterprise, rollover credits and no annual lock-in. Start with 500 credits.",
		},
		// Copy from the "Influenze - LP" doc, Pricing LP. Anything not set here uses shared.ts.
		headings: {
			heroTitle: "Influenze.ai Pricing:\n*How Credits Work*",
			heroBody:
				"Influenze.ai pricing is built on credits. Every action costs a set number of credits (a search, a profile analytics unlock, a contact unlock) and work-email signups start with 500 credits. Add up the actions a brief needs to estimate its cost before choosing a plan.",
			creditsEyebrow: "Influenze.ai Pricing Per Action",
			estimatorHeading: "Estimate Your *Influenze.ai Credits*",
			plansHeading: "Influenze.ai Pricing Plans",
			plansAccent: "That Fit How You Work",
			plansIncluded: "Included In Every Influenze.ai Plan",
			oneTimeHeading: "Running a *One-Time\nCampaign?*",
			oneTimeBody:
				"Influenze.ai pricing works for single campaigns too. Sign up with a work email, use the 500 credits, and top up only if the brief needs more.",
			quoteHeading: "Influenze.ai Pricing vs Quote-Led\nand Annual Platforms",
		},
		faqs: [
			{
				question: "How does Influenze.ai pricing work?",
				answer:
					"Influenze.ai pricing is credit-based. Each action, such as a search, a profile analytics unlock or a contact detail unlock, costs a published number of credits, so you pay for the actions you run rather than for seats.",
			},
			{
				question: "How many credits does each action cost?",
				answer:
					"A direct search (1 result) costs 5 credits, a filtered search (10 results per page) costs 50 credits, a profile analytics unlock costs 50 credits and a contact detail unlock costs 5 credits.",
			},
			{
				question: "What Influenze.ai plans are available?",
				answer:
					"Influenze.ai pricing runs across Starter, Growth, Scale and Enterprise tiers, billed monthly plus taxes. Paying annually adds 5% more credits. Every plan includes the 450M+ profile database, profile analytics, contact details, sharing, AI-driven parameter search, bulk import and export, custom lists and access to all social platforms.",
			},
			{
				question: "Do unused credits roll over?",
				answer:
					"Yes. Unused credits roll over while you stay subscribed, so credits you don't use this month remain available.",
			},
			{
				question: "Is there a free trial, and what's included?",
				answer:
					"Sign up with a work email and you get 500 credits, with no sales call required. For example, 5 searches, 5 profile analytics unlocks and 10 contact unlocks use 325 credits, which fits inside the signup credits.",
			},
			{
				question: "Do I need an annual contract?",
				answer:
					"No. Influenze.ai pricing has no mandatory annual lock-in. Plans are billed monthly, and one-time campaigns can run on signup credits plus top-ups.",
			},
		],
	},
];

export * from "./shared";
