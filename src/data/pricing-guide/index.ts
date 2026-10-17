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
		slug: "how-credits-work",
		name: "How Credits Work",
		draft: true,
		seo: {
			title: "Influenze.ai Pricing: Plans, Credits and Costs",
			description:
				"Influenze.ai pricing explained: per-action credit costs, plans from Starter to Enterprise, rollover credits and no annual lock-in. Start with 500 credits.",
		},
	},
];

export * from "./shared";
