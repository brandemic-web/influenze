/**
 * Defaults for every /for/<audience> page, drawn from the Figma "ICP" frame
 * (Influenze.ai Branding – Web UI, node 2194:3352). A Sanity "ICP Page" overrides any of
 * it; empty fields keep these. `*stars*` mark brand-green words.
 */
import type { CompareRow, CopyField } from "../compare/shared";
import { FAQ_HEADING, FAQ_SUBCOPY } from "../faqs";
import { BRIEFS } from "../platform/shared";

export { plainText, twoTone } from "../compare/shared";
export { resolveSlots, type CardText } from "../alternative/shared";
export { BRIEFS, type BriefId } from "../platform/shared";

/** The five workflow steps under the app screen. */
export const WORKFLOW_PILLS = ["Brief", "Search", "Analyze", "Shortlist", "Client Review"];

export const SLOWS_CARDS = [
	{ id: "restarts", title: "Every Brief Restarts Research", body: "The same manual platform searches, one client at a time." },
	{ id: "spreadsheets", title: "Lists Live In Spreadsheets", body: "Saved posts and old sheets drift out of date between campaigns." },
	{ id: "screenshots", title: "Approvals Run On Screenshots", body: "Clients review inconsistent evidence, so approvals slow down." },
] as const;
export type SlowsId = (typeof SLOWS_CARDS)[number]["id"];

/** "Before and after" — Before is the label column; Influenze's half is the raised column. */
export const BEFORE_AFTER_ROWS = [
	{ id: "searches", label: "Manual Platform Searches", influenze: { mark: true, text: "One Structured Discovery Workflow" } },
	{ id: "spreadsheets", label: "Old Spreadsheets And Saved Posts", influenze: { mark: true, text: "Reusable Campaign Or Network Lists" } },
	{ id: "followers", label: "Follower-Count Shortlisting", influenze: { mark: true, text: "Deeper Creator And Audience Evaluation" } },
	{ id: "screenshots", label: "Screenshot-Based Client Approvals", influenze: { mark: true, text: "Shareable, Consistent Shortlists" } },
	{ id: "network", label: "Starting From The Same Network", influenze: { mark: true, text: "Search Beyond Known Creators" } },
] as const satisfies readonly CompareRow[];
export type BeforeAfterId = (typeof BEFORE_AFTER_ROWS)[number]["id"];

/** "A smarter way to discover creators" — four steps beside the filters mockup. */
export const SMARTER_STEPS = [
	{ id: "discover", icon: "search", title: "Discover", body: "Turn the brief into semantic and\nparameter-led search." },
	{ id: "analyze", icon: "users", title: "Analyze", body: "Check audience, engagement and growth before\nyou recommend." },
	{ id: "organize", icon: "squareCheckBig", title: "Organize And Compare", body: "Keep lists per client and compare candidates\nside by side." },
	{ id: "share", icon: "share", title: "Share & Contact", body: "Send a client-safe shortlist and unlock\naggregated contacts." },
] as const;
export type SmarterId = (typeof SMARTER_STEPS)[number]["id"];

/** "What one client brief takes" — the actions behind the estimate. */
export const BRIEF_COST_LINES = ["20 Searches", "6 profiles analyzed", "10 contacts unlocked"];

export const ICP_COPY_FIELDS = [
	{ key: "heroEyebrow", group: "hero", title: "Label above the title", default: "For Agencies" },
	{ key: "heroTitle", group: "hero", title: "Title", default: "Client-Ready Shortlists.\nZero Spreadsheets.", twoTone: true, long: true },
	{
		key: "heroBody",
		group: "hero",
		title: "Text in the frame",
		default: "Discover, evaluate and shortlist creators from *450M+* profiles. Share lists and streamline client approvals.",
		twoTone: true,
		long: true,
	},
	{ key: "heroCta", group: "hero", title: "Button label", default: "Build Your First Agency Shortlist" },
	{ key: "workflowHeading", group: "workflow", title: "Heading", default: "Built For Your Workflow", twoTone: true },
	{ key: "slowsHeading", group: "slows", title: "Heading", default: "What Slows Creator Discovery", twoTone: true },
	{ key: "beforeAfterHeading", group: "beforeAfter", title: "Heading", default: "Before And After Influenze.ai", twoTone: true },
	{
		key: "beforeAfterSubcopy",
		group: "beforeAfter",
		title: "Subheading",
		default: "Not just another data platform — we verify, score, and surface only what matters.",
		long: true,
	},
	{ key: "smarterHeading", group: "smarter", title: "Heading", default: "A Smarter Way\n*To Discover Creators*", twoTone: true, long: true },
	{ key: "briefsHeading", group: "briefs", title: "Heading", default: "A Live Brief, Start To Finish", twoTone: true },
	{ key: "costHeading", group: "cost", title: "Heading", default: "What One Client Brief Takes", twoTone: true },
	{
		key: "costSubcopy",
		group: "cost",
		title: "Subheading",
		default: "Search, analyze the top candidates and unlock contacts for the final list.",
		long: true,
	},
	{ key: "costTotal", group: "cost", title: "Total", default: "≈ 450 credits" },
	{ key: "faqHeading", group: "faq", title: "Heading", default: FAQ_HEADING },
	{ key: "faqSubcopy", group: "faq", title: "Subheading", default: FAQ_SUBCOPY, long: true },
] as const satisfies readonly (CopyField & { group: string })[];

export type IcpCopyKey = (typeof ICP_COPY_FIELDS)[number]["key"];
export type IcpCopy = Record<IcpCopyKey, string>;

export function resolveIcpCopy(overrides: Partial<Record<string, string | undefined>> | undefined) {
	return Object.fromEntries(ICP_COPY_FIELDS.map((f) => [f.key, overrides?.[f.key]?.trim() || f.default])) as IcpCopy;
}

export { BRIEFS as ICP_BRIEFS };
