/**
 * Pure helpers shared by PricingPlans.astro (server render) and
 * pricingPlans.ts (client updates), so the first paint and every subsequent
 * drag run through exactly the same maths.
 *
 * The slider is a SEGMENTED scale, not a linear one: the four tier dots are
 * spaced evenly along the track (matching Figma), and each adjacent pair of
 * tiers owns one equal-width segment. Spend interpolates linearly *within* a
 * segment between the two tiers' `minSpend` values. A linear spend scale would
 * bunch all three lower dots into the first ~40% of the track.
 */

import {
	PRICING_TIERS,
	SLIDER_MIN,
	SLIDER_MAX,
	ANNUAL_BONUS_PCT,
	type PricingTier,
} from "../../data/pricing";

/** Spend is snapped to this increment while dragging, in ₹. */
export const SPEND_STEP = 1_000;

/** Clamp a number to the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Figma renders the amounts with western thousands grouping ("Rs 100,000+",
 * "24,200"), not the Indian lakh grouping en-IN would produce ("1,00,000").
 */
const GROUPED = new Intl.NumberFormat("en-US");

export function formatAmount(value: number): string {
	return GROUPED.format(Math.round(value));
}

export function formatPrice(value: number): string {
	return `₹${formatAmount(value)}`;
}

/**
 * Stop positions along the track, in percent, one per tier. The first dot sits
 * at the first tab's left edge; the rest sit at the midpoint of the gap between
 * each pair of adjacent tabs, so they read as sitting "between" the two tiers
 * rather than glued to the next tab's edge.
 *
 * The tab row is the rail's width, holding four equal columns with a 0.75rem
 * gap, so a column starts at i × (width + gap) / railWidth and a gap midpoint
 * sits half a gap-width earlier: 0 / 24.66 / 50.00 / 75.34 (measured, holds at
 * every viewport since the row width and the gap both scale with the root font
 * size). Keep in step with the tablist's `lg:grid-cols-4` and `gap-3`.
 *
 * The rail runs on past Enterprise's dot: everything beyond ₹1,00,000 is quoted
 * rather than priced, which is the stretch the "looking for more flexibility"
 * block speaks to.
 */
export const STOP_POSITIONS = [0, 24.66, 50, 75.34];

/** How many leading stops render a visible dot — every tier, including Enterprise. */
export const VISIBLE_DOTS = 4;

/**
 * Where the priced range ends. The rail runs on past the last dot; anything in
 * that stretch is above the top price, so the panel quotes instead of pricing.
 */
export const CUSTOM_ZONE_START = STOP_POSITIONS[STOP_POSITIONS.length - 1];

/** Is this position in the quote-only stretch past the last dot? */
export function isCustomPos(pos: number): boolean {
	return pos > CUSTOM_ZONE_START;
}

/**
 * Which stop the upper price caption labels. Kept separate from VISIBLE_DOTS so
 * adding or removing a dot does not move the caption: it belongs to Scale, whose
 * "Rs 50,000+" reads as the top of the self-serve range.
 */
export const CAPTION_STOP = 2;

/** Stop positions (percent along the track), one per tier. */
export function stopPositions(tiers: PricingTier[] = PRICING_TIERS): number[] {
	// Fall back to even spacing if the tier list ever stops matching the
	// hand-measured Figma stops, so the slider still spans the whole track.
	if (tiers.length === STOP_POSITIONS.length) return STOP_POSITIONS;
	const last = tiers.length - 1;
	return tiers.map((_, i) => (last === 0 ? 0 : (i / last) * 100));
}

/** Percent along the track → monthly spend in ₹, snapped to SPEND_STEP. */
export function spendFromPos(
	pos: number,
	tiers: PricingTier[] = PRICING_TIERS,
): number {
	const stops = stopPositions(tiers);
	const p = clamp(pos, 0, 100);

	// Walk to the segment containing `p`. The final stop has no segment of its
	// own, hence stops.length - 1.
	for (let i = 0; i < stops.length - 1; i++) {
		const from = stops[i];
		const to = stops[i + 1];
		if (p > to) continue;

		const span = to - from || 1;
		const t = (p - from) / span;
		const spend =
			tiers[i].minSpend + t * (tiers[i + 1].minSpend - tiers[i].minSpend);
		return clamp(
			Math.round(spend / SPEND_STEP) * SPEND_STEP,
			SLIDER_MIN,
			SLIDER_MAX,
		);
	}
	return SLIDER_MAX;
}

/** Monthly spend in ₹ → percent along the track (inverse of spendFromPos). */
export function posFromSpend(
	spend: number,
	tiers: PricingTier[] = PRICING_TIERS,
): number {
	const stops = stopPositions(tiers);
	const value = clamp(spend, SLIDER_MIN, SLIDER_MAX);

	for (let i = 0; i < tiers.length - 1; i++) {
		const lo = tiers[i].minSpend;
		const hi = tiers[i + 1].minSpend;
		if (value > hi) continue;

		const span = hi - lo || 1;
		return stops[i] + ((value - lo) / span) * (stops[i + 1] - stops[i]);
	}
	return 100;
}

/**
 * Index of the tier a given spend falls into: the highest tier whose
 * `minSpend` the spend has reached.
 */
export function tierIndexFromSpend(
	spend: number,
	tiers: PricingTier[] = PRICING_TIERS,
): number {
	let index = 0;
	tiers.forEach((tier, i) => {
		if (spend >= tier.minSpend) index = i;
	});
	return index;
}

/** Credits granted for a spend, including the tier and annual bonuses. */
export function creditsFor(
	spend: number,
	tier: PricingTier,
	annual = false,
): number {
	const bonus = tier.bonusPct + (annual ? ANNUAL_BONUS_PCT : 0);
	return Math.round(spend * (1 + bonus / 100));
}

/** "(+10% bonus)" caption under the credits figure. */
export function bonusLabel(tier: PricingTier, annual = false): string {
	const bonus = tier.bonusPct + (annual ? ANNUAL_BONUS_PCT : 0);
	return bonus > 0 ? `Credits/mo (+${bonus}% bonus)` : "Credits/mo";
}
