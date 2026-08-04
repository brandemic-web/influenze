import gsap from "gsap";

/**
 * The entrance every CreatorsAI panel opens with: its cards rise into place.
 *
 * Each card sits in its own untransformed wrapper (see CreatorsAI.astro) so this
 * can own `transform` without clobbering the component's own `scale`.
 *
 * Split into rest-state vars and a tween because a beat sets the rest state in
 * its block of `set()`s at position 0 — the rewind that makes the demo replayable
 * — and plays the tween forward from there.
 */

/** Distance (px, unscaled stage space) cards travel up from. */
const RISE = 40;

/** Where the cards sit before the beat runs. */
export const CARDS_DOWN = { y: RISE, autoAlpha: 0 };

export function landCards(items: gsap.TweenTarget, stagger = 0.18) {
	return gsap.to(items, { y: 0, autoAlpha: 1, duration: 0.7, stagger, ease: "power2.out" });
}
