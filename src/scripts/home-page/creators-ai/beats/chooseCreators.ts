import gsap from "gsap";
import { CARDS_DOWN, landCards } from "../utils/cards";
import type { DemoContext } from "../utils/demo";

/**
 * Beat 3 — Choose The Right Creators.
 *
 * The pieces stagger up in DOM order, then the Compare card scrolls its own body
 * down to show that there is more below the fold. It stays scrollable by hand
 * afterwards — the beat only nudges the visitor into trying it.
 *
 * The scroll waits for the cards: reading a list that is still fading in tells the
 * visitor nothing, so the whole of the entrance plays out before anything moves.
 * That is what the `landed` label marks — added with no position, so it sits
 * wherever the staggered entrance actually finishes rather than at a time guessed
 * from its duration.
 *
 * The cursor parks over the card and the body scrolls *under* it, the way a wheel
 * works — no cursor travel during the scroll, because a wheel does not move the
 * pointer. Same idiom as the hero's rail scroll.
 */

/** Fraction of the Compare card's scrollable height the beat travels. */
const SCROLL_REVEAL = 0.85;

/** Seconds after the entrance lands before the body starts moving. */
const SETTLE = 0.55;

/** Seconds the cursor takes to reach the card. */
const REACH = 0.6;

export function chooseCreators({ panel, pointer }: DemoContext) {
	const items = gsap.utils.toArray<HTMLElement>("[data-panel-item]", panel);
	if (!items.length) return;

	const tl = gsap
		.timeline({ paused: true, defaults: { ease: "power2.out" } })
		.set(items, CARDS_DOWN)
		.add(landCards(items), 0.1)
		.addLabel("landed");

	// The scroller is the only optional hook here: without it the cards still land,
	// which is the whole of the panel's job, so the beat degrades rather than bails.
	const scroller = panel.querySelector<HTMLElement>("[data-compare-scroll]");
	if (!scroller) return tl;

	tl.set(scroller, { scrollTop: 0 }, 0);

	// The cursor arrives just as the body starts to move, so the two read as one
	// gesture. It reaches for the card while the entrance is still settling.
	if (pointer) {
		tl.set(pointer.el, pointer.homeVars(), 0)
			.set(pointer.ring, pointer.ringVars(), 0)
			.add(pointer.fadeIn(), "landed")
			.add(pointer.moveTo(scroller, { at: { x: 0.55, y: 0.4 }, duration: REACH }), "landed");
	}

	// Measured on play, so a re-run picks up whatever the card's content is now.
	tl.to(
		scroller,
		{
			scrollTop: () => (scroller.scrollHeight - scroller.clientHeight) * SCROLL_REVEAL,
			duration: 2.2,
			ease: "power1.inOut",
		},
		`landed+=${SETTLE}`,
	);

	if (pointer) tl.add(pointer.fadeOut(), ">0.3");

	return tl;
}
