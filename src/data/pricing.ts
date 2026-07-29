/**
 * Pricing page content.
 *
 * The page is driven by one interactive panel (PricingPlans.astro): four tier
 * tabs sit above a card holding a draggable spend slider. Dragging the slider
 * picks a monthly spend between SLIDER_MIN and SLIDER_MAX; the tier tab, the
 * price and the credits figure all derive from that spend ("Tier updates as you
 * drag", per the Figma subtitle).
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ PLACEHOLDER NUMBERS — READ BEFORE SHIPPING                              │
 * │                                                                         │
 * │ Figma specifies EXACTLY ONE state: Growth at ₹22,000/mo → 24,200        │
 * │ credits (+10% bonus), annual = +5% credits, range Rs. 1,000–100,000+.   │
 * │ Those five numbers below are taken from the design and are correct.     │
 * │                                                                         │
 * │ Everything else is a PLACEHOLDER chosen to make the slider behave        │
 * │ sensibly — specifically each tier's `minSpend` threshold and the         │
 * │ `bonusPct` for Starter / Scale. Confirm all of these with whoever owns   │
 * │ pricing, then edit only this file; the panel needs no other changes.     │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export interface PricingTier {
	/** Stable id, used as the tab value. */
	id: string;
	/** Tab label (rendered uppercase). */
	name: string;
	/**
	 * Inclusive lower bound of this tier's monthly spend, in ₹. The slider maps
	 * each adjacent pair of tiers to an equal-width track segment, so these
	 * thresholds set the tier boundaries but not the dot spacing.
	 */
	minSpend: number;
	/** Bonus credits granted on top of spend, as a percentage. */
	bonusPct: number;
	/**
	 * When true this tier has no self-serve price: the panel swaps the
	 * price/credits/subscribe row for the "talk to us" block (see CUSTOM_PLAN).
	 */
	custom?: boolean;
}

export const PRICING_HEADING = {
	lead: "Plans That ",
	accent: "Fit How You Work",
	sub: "Tier updates as you drag",
};

/** Slider bounds in ₹. From Figma: "Rs. 1,000" → "Rs 100,000+". */
export const SLIDER_MIN = 1_000;
export const SLIDER_MAX = 100_000;

/** Monthly spend selected on first paint. Figma shows ₹22,000 (Growth). */
export const DEFAULT_SPEND = 22_000;

/** Extra credits granted for paying annually, as a percentage. */
export const ANNUAL_BONUS_PCT = 5;

export const PRICING_TIERS: PricingTier[] = [
	{ id: "starter", name: "Starter", minSpend: SLIDER_MIN, bonusPct: 0 },
	// Growth is the one tier Figma pins down: ₹22,000 → 24,200 = +10%.
	{ id: "growth", name: "Growth", minSpend: 10_000, bonusPct: 10 },
	{ id: "scale", name: "Scale", minSpend: 40_000, bonusPct: 20 },
	{
		id: "enterprise",
		name: "Enterprise",
		minSpend: SLIDER_MAX,
		bonusPct: 0,
		custom: true,
	},
];

/** Copy for the Enterprise tier, which quotes instead of pricing. */
export const CUSTOM_PLAN = {
	eyebrow: "Custom",
	title: "Looking for More Flexibility?",
	body: "Get a tailored plan with White-labeling, a custom creator link-in-bio, and features built for your team. Available for teams of 3 or more users.",
	ctaLabel: "Get in Touch",
};

export const PRICE_NOTE = "Billed monthly + Taxes";
export const ANNUAL_LABEL = "Pay Annually:";
export const CREDITS_ROLLOVER = "Unused credits roll over";
export const SUBSCRIBE_LABEL = "Subscribe";

/** Features every tier includes, rendered as a two-column checklist. */
export const PLAN_FEATURES = [
	"450M+ Profile Database",
	"AI-Driven Parameter Search",
	"Profile Analytics",
	"Bulk Import and Export",
	"Profile contact details",
	"Custom Lists",
	"Sharing",
	"All Social Platform Access",
];

/** Per-action credit costs, shared across all tiers. */
export const CREDIT_COSTS = [
	{ label: "Direct search", detail: "1 result", cost: "5 Credits" },
	{ label: "Filtered search", detail: "10 results/page", cost: "50 Credits" },
	{ label: "Profile analytics unlock", detail: "", cost: "50 Credits" },
	{ label: "Contact detail unlock", detail: "", cost: "5 Credits" },
];

/**
 * Credit Recharge block (CreditRecharge.astro).
 *
 * This section is a HIDDEN layer in Figma, so it could not be rendered for
 * visual reference — the copy and structure below come from the layer names and
 * geometry only. Treat the styling as a best-effort match and the amounts as
 * PLACEHOLDERS: only the Growth row (₹10,000 → ₹11,000, i.e. +10%) is given.
 */
export const CREDIT_RECHARGE = {
	title: "Credit Recharge",
	body: "Top up your account anytime and earn 10% bonus credits on every recharge.",
	currentPlanLabel: "Current plan",
	rechargeLabel: "Recharge",
	creditsWorthLabel: "You get credits worth",
	contactLabel: "Contact us",
	options: [
		{ id: "growth", name: "Growth", recharge: 10_000, bonusPct: 10 },
		{ id: "accelerate", name: "Accelerate", recharge: 25_000, bonusPct: 20 },
	],
};
