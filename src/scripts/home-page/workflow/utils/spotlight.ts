import gsap from "gsap";

/**
 * An explainer card's turn on screen.
 *
 * It plays *over* the story rather than interrupting it: `index.ts` inserts
 * this at the master time its beat ends, so the card fades up while the next
 * beat is already running underneath. Nothing in here touches the mockup — the
 * card is the only thing that moves.
 *
 * The card is left hidden at the end, which is also what winds it back for the
 * loop — the same rule every beat follows.
 *
 * The card arrives black and its violet fills in behind the text a beat later —
 * a layer's opacity rather than a background swap, because the fill is a radial
 * gradient and gradients do not tween. See `WorkflowCard.astro`.
 *
 * Opacity and a small rise only. `yPercent` is a fraction of the card's own
 * height rather than a length, so it needs no unit conversion and cannot go
 * stale when the stage rescales — the trap that keeps the rest of the story
 * off transforms. Nothing else translates the card, so there is no authored
 * percentage translate for GSAP to fold in (see the note in beat 5).
 */

/** Matches the fade the modals use, so the card arrives like the rest of the UI. */
const IN = 0.36;
const OUT = 0.28;
const RISE = 18;
/** The black-to-violet settle: slower than the entrance, so it reads as a fill. */
const FILL = 0.55;
const FILL_DELAY = 0.12;

/**
 * The hold that makes a card start fading out `span` seconds after it starts
 * fading up — how a card timed to a pair of story marks works out its dwell.
 * Clamped at 0, so marks that land too close together still give a clean blip
 * rather than a card that fades out before it is up.
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

	// The dwell is measured from the card being fully settled, so a longer fill
	// does not eat into how long it is readable.
	return tl
		.to(card, { opacity: 0, duration: OUT, ease: "power2.in" }, `+=${dwell}`)
		.set(card, { visibility: "hidden" });
}
