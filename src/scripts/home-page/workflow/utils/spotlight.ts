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

/**
 * The hold that makes a card start fading out `span` seconds after it starts
 * fading up — how a card timed to a pair of story marks works out its dwell.
 * Clamped at 0, so marks that land too close together still give a clean blip
 * rather than a card that fades out before it is up.
 */
export const holdForSpan = (span: number) => Math.max(0, span - IN);

export function spotlight(card: HTMLElement, dwell: number) {
	return gsap
		.timeline()
		.set(card, { visibility: "visible" })
		.fromTo(
			card,
			{ opacity: 0, yPercent: RISE },
			{ opacity: 1, yPercent: 0, duration: IN, ease: "power2.out" },
		)
		.to(card, { opacity: 0, duration: OUT, ease: "power2.in" }, `+=${dwell}`)
		.set(card, { visibility: "hidden" });
}
