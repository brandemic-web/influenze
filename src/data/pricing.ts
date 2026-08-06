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
 * │ Design specifies EXACTLY ONE state: Growth at ₹22,000/mo → 24,200        │
 * │ credits (+10% bonus), annual = +5% credits, range Rs. 1,000–100,000+.   │
 * │ Those five numbers below are taken from the design and are correct.     │
 * │                                                                         │
 * │ Starter is confirmed too: ₹1,000–₹20,000 → +5% bonus.                   │
 * │                                                                         │
 * │ Everything else is a PLACEHOLDER chosen to make the slider behave        │
 * │ sensibly — specifically each tier's `minSpend` threshold and the         │
 * │ `bonusPct` for Scale / Enterprise. Confirm all of these with whoever     │
 * │ owns pricing, then edit only this file; the panel needs no other changes.│
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

/** Slider bounds in ₹. "Rs. 1,000" → "Rs 100,000+". */
export const SLIDER_MIN = 1_000;
export const SLIDER_MAX = 100_000;

/**
 * Monthly spend selected on first paint: the bottom of the Starter tier, so
 * the panel opens on Starter at its entry price of ₹1,000.
 */
export const DEFAULT_SPEND = SLIDER_MIN;

/** Extra credits granted for paying annually, as a percentage. */
export const ANNUAL_BONUS_PCT = 5;

export const PRICING_TIERS: PricingTier[] = [
	// Starter covers ₹1,000–₹20,000 (up to Growth's floor) at +5%.
	{ id: "starter", name: "Starter", minSpend: SLIDER_MIN, bonusPct: 5 },
	// Growth is the one tier Figma pins down: ₹22,000 → 24,200 = +10%.
	{ id: "growth", name: "Growth", minSpend: 20_000, bonusPct: 10 },
	{ id: "scale", name: "Scale", minSpend: 50_000, bonusPct: 20 },
	{
		id: "enterprise",
		name: "Enterprise",
		minSpend: SLIDER_MAX,
		// Never rendered: reaching ₹1,00,000 puts the panel in quote mode, so the
		// bonus is whatever the Enterprise conversation lands on.
		bonusPct: 0,
		custom: true,
	},
];

/**
 * Copy for the Enterprise tier, which quotes instead of pricing.
 */
export const CUSTOM_PLAN = {
	priceLabel: "Custom",
	priceSuffix: "/mo",
	note: "Quoted to your usage + Taxes",
	creditsCaption: "Credits/mo and up",
	/** Qualifier pill — the one thing that gates this tier. */
	badge: "For larger teams",
	ctaLabel: "Get in Touch",
	contactEmail: "harsh@dotme.in",
	contactSubject: "Enterprise plan enquiry",
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

export interface CreditCost {
	label: string;
	detail: string;
	cost: string;
	/** Explanation revealed on hover/focus of the row's info icon. */
	tooltip: string;
}

/** Per-action credit costs, shared across all tiers. */
export const CREDIT_COSTS: CreditCost[] = [
	{
		label: "Direct search",
		detail: "1 result",
		cost: "5 Credits",
		tooltip:
			"5 credits are deducted for each creator/account in the analyzed results.",
	},
	{
		label: "Profile analytics unlock",
		detail: "",
		cost: "50 Credits",
		tooltip:
			"50 credits are deducted for every creator/account media kit unlocked.",
	},
	{
		label: "Contact detail unlock",
		detail: "",
		cost: "5 Credits",
		tooltip:
			"5 credits are deducted for every creator/account contact details unlocked.",
	},
];
