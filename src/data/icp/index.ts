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
	},
];

export const icpHref = (slug: string) => `/for/${slug}/`;

export * from "./shared";
