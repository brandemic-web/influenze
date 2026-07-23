/**
 * Pricing page content.
 *
 * The pricing page is a single interactive panel: a 4-stop plan stepper drives
 * the three value columns (price / credits / add-on bonus). Everything else on
 * the panel — the features, the "how credits work" table and the "best for"
 * tag — is shared across every tier.
 *
 * NOTE: the per-tier `price`, `credits`, `creditsBonus` and `addOn` values are
 * PLACEHOLDERS. Only the Growth tier is specified in Figma; the rest reuse the
 * previous plan numbers so the stepper demonstrates real switching. Swap these
 * for the final numbers when they land — the stepper needs no other changes.
 */

export interface PricingTier {
	/** Stable id, used as the stepper value. */
	id: string;
	/** Short label shown under the stepper dot. */
	name: string;
	/** Big price figure (placeholder — see file note). */
	price: string;
	/** Small line under the price, e.g. "/mo + Taxes". */
	priceUnit: string;
	/** Big credits figure (placeholder — see file note). */
	credits: string;
	/** Green line under the credits, e.g. "+1000 Free Credits". */
	creditsBonus: string;
	/** Big add-on figure, e.g. "+10%". */
	addOn: string;
	/** Small line under the add-on figure. */
	addOnNote: string;
}

export const PRICING_HEADING = {
	lead: "Plans that ",
	accent: "cater to you",
};

/** Which stop is selected on first paint (0-based). Growth is the Figma default. */
export const DEFAULT_TIER_INDEX = 1;

export const PRICING_TIERS: PricingTier[] = [
	{
		id: "starter",
		name: "Starter",
		price: "₹6,000",
		priceUnit: "/mo + Taxes",
		credits: "6,000",
		creditsBonus: "No bonus credits",
		addOn: "+0%",
		addOnNote: "Credit add on of any amount",
	},
	{
		id: "growth",
		name: "Growth",
		price: "₹10,000",
		priceUnit: "/mo + Taxes",
		credits: "11,000",
		creditsBonus: "+1000 Free Credits",
		addOn: "+10%",
		addOnNote: "Credit add on of any amount",
	},
	{
		id: "accelerate",
		name: "Accelerate",
		price: "₹20,000",
		priceUnit: "/mo + Taxes",
		credits: "24,000",
		creditsBonus: "+4000 Free Credits",
		addOn: "+20%",
		addOnNote: "Credit add on of any amount",
	},
	{
		id: "scale",
		name: "Scale",
		price: "₹30,000",
		priceUnit: "/mo + Taxes",
		credits: "37,500",
		creditsBonus: "+7500 Free Credits",
		addOn: "+25%",
		addOnNote: "Credit add on of any amount",
	},
	{
		id: "custom",
		name: "Custom",
		price: "Let's Talk",
		priceUnit: "Tailored to your team",
		credits: "Custom",
		creditsBonus: "Volume free credits",
		addOn: "Custom",
		addOnNote: "Bespoke add-on rates",
	},
];

/** Features every tier includes (shown as pills). */
export const PLAN_FEATURES = [
	"Analyze 450M+ Creators",
	"Media Kits",
	"CSV Upload",
	"Contact Unlocks",
	"Share Profiles and lists",
	"Lists",
];

/** Per-action credit costs, shared across all tiers. */
export const CREDIT_COSTS = [
	{ label: "Per Displayed Result", cost: "5 Credits" },
	{ label: "Per Creator Analytics Unlock", cost: "50 Credits" },
	{ label: "Per Contact Details Unlock", cost: "5 Credits" },
];

export const BEST_FOR = "DAILY CAMPAIGNS";

export const CREDITS_CARRYOVER = {
	title: "Your Credits Stay With You",
	body: "Unused credits are carried forward and remain available for future use.",
};
