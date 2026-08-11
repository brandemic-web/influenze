import gsap from "gsap";

/**
 * An explainer card's turn on screen. Plays *over* the story — `index.ts` inserts it
 * at its beat's end time — and touches nothing but the card. Left hidden at the end,
 * which is also what winds it back for the loop.
 *
 * The card arrives black and its violet fills in behind the text via a layer's
 * opacity, because the fill is a radial gradient and gradients don't tween.
 * `yPercent` is used for the rise so nothing goes stale when the stage rescales.
 */

/** Matches the modals' fade, so the card arrives like the rest of the UI. */
const IN = 0.36;
const OUT = 0.28;
const RISE = 18;
/** Slower than the entrance, so the black-to-violet reads as a fill. */
const FILL = 0.55;
const FILL_DELAY = 0.12;

/**
 * Dwell for a card timed to a pair of story marks: start fading out `span` seconds
 * after fading up. Clamped at 0 so marks too close together still give a clean blip.
 */
export const holdForSpan = (span: number) => Math.max(0, span - IN);

export function spotlight(card: HTMLElement, dwell: number) {
	const fill = card.querySelector<HTMLElement>("[data-wf-card-fill]");

	const tl = gsap
		.timeline()
		.set(card, { visibility: "visible" })
		// Back to black for the loop's next time round.
		.set(fill, { opacity: 0 })
		.fromTo(
			card,
			{ opacity: 0, yPercent: RISE },
			{ opacity: 1, yPercent: 0, duration: IN, ease: "power2.out" },
		);

	if (fill) tl.to(fill, { opacity: 1, duration: FILL, ease: "power2.inOut" }, `>-${FILL_DELAY}`);

	// Dwell runs from the card being fully settled, so a longer fill does not eat
	// into how long it is readable.
	return tl
		.to(card, { opacity: 0, duration: OUT, ease: "power2.in" }, `+=${dwell}`)
		.set(card, { visibility: "hidden" });
}
