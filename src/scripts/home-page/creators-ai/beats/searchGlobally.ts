import gsap from "gsap";
import { CARDS_DOWN, landCards } from "../utils/cards";
import { fade } from "../utils/color";
import type { DemoContext } from "../utils/demo";
import { CHARS_HIDDEN, TYPE_SPEED, blinkCaret, splitChars, typeChars } from "../utils/type";

/**
 * Beat 1 — Search Globally, from an untouched filter panel to a lookalike search
 * with a follower tier and a location on it.
 *
 * A cursor walks the UI: the three cards land, the Mega Account tier is ticked
 * open and its engagement slider unfolds, then the lookalike handle and the
 * creator location are typed in and a region pill drops into the list.
 *
 * Everything is reached through the `data-search-*` / `data-metrics-*` hooks in
 * SearchUi.astro, PlatformUi.astro and FollowerMetricsUi.astro. The beat is
 * self-contained: it winds all three cards back to their untouched state first,
 * so it can be replayed from the top every time its tab comes round.
 */

/**
 * Where the engagement knob sits before the drag, in the card's own pixels — the
 * tier's average cut, which is what the filter opens on. The hand pulls it left
 * from here to the minimum, which is the "accept every range" the settled markup
 * reads out.
 */
const KNOB_OFFSET = 200;

/** Seconds the drag itself takes. */
const DRAG = 1;

/**
 * Every element the beat drives, or null if this is not the panel we expect.
 * The mapped return type is what lets the timeline treat them as non-nullable.
 */
function collect(panel: HTMLElement) {
	const q = <T extends HTMLElement>(selector: string) => panel.querySelector<T>(selector);
	// Both typed fields hold their own caret, so those two are scoped to their field.
	const handleField = q('[data-search-field="handle"]');
	const regionField = q('[data-search-field="region"]');

	const el = {
		apply: q("[data-search-apply]"),
		row: q("[data-metrics-row]"),
		check: q("[data-metrics-check]"),
		idleCheck: q("[data-metrics-idle-check]"),
		dot: q("[data-metrics-dot]"),
		expand: q("[data-metrics-expand]"),
		track: q("[data-metrics-track]"),
		slider: q("[data-metrics-slider]"),
		knob: q("[data-metrics-knob]"),
		pill: q("[data-search-pill]"),
		handleField,
		handleText: handleField?.querySelector<HTMLElement>("[data-search-text]") ?? null,
		handleCaret: handleField?.querySelector<HTMLElement>("[data-search-caret]") ?? null,
		regionField,
		regionText: regionField?.querySelector<HTMLElement>("[data-search-text]") ?? null,
		regionCaret: regionField?.querySelector<HTMLElement>("[data-search-caret]") ?? null,
	};

	type Found = { [K in keyof typeof el]: NonNullable<(typeof el)[K]> };
	if (!Object.values(el).every(Boolean)) return null;

	const cards = gsap.utils.toArray<HTMLElement>("[data-search-card]", panel);
	if (cards.length < 3) return null;

	return { ...(el as Found), cards };
}

export function searchGlobally({ panel, pointer }: DemoContext) {
	const el = collect(panel);
	if (!el || !pointer) return;

	// This is the default panel, so unlike the other three its markup renders
	// visible — and the settled collage would paint for the frame between this
	// module running and the harness rendering the timeline's position 0. Putting
	// the cards down here, as the beat is built, closes that frame: the same vars
	// the rewind below uses, applied immediately rather than on first render.
	gsap.set(el.cards, CARDS_DOWN);

	// The tier's settled colours, read straight out of the markup before anything
	// rewinds them — so nothing here restates a value FollowerMetricsUi.astro owns.
	// The unselected border comes off a sibling row, which is the only place the
	// "before" colour is authored at all.
	const rowActive = getComputedStyle(el.row).backgroundColor;
	const checkFill = getComputedStyle(el.check).backgroundColor;
	const checkBorder = getComputedStyle(el.idleCheck).borderColor;

	// Split once, at build time: the chars are real elements, and re-splitting on
	// every play would hand the timeline a fresh set the old tweens don't know about.
	const handleChars = splitChars(el.handleText);
	const regionChars = splitChars(el.regionText);

	/**
	 * How much of the range bar is filled with the knob parked at `KNOB_OFFSET`.
	 *
	 * The bar grows from its right edge, so the fraction not yet filled is exactly
	 * the knob's distance along the track — which is what keeps the bar's left edge
	 * under the knob for the whole drag instead of only at the two ends. Measured
	 * lazily off the layout, so it holds whatever width the card is given.
	 */
	const rangeAtKnob = () => {
		const track = el.track.offsetWidth;
		if (!track) return 0;
		return gsap.utils.clamp(0, 1, 1 - (KNOB_OFFSET + el.knob.offsetWidth / 2) / track);
	};

	/**
	 * Where the knob's centre comes to rest, as a fraction across the track — the
	 * hand's destination for the drag.
	 *
	 * Both terms are read in the card's own pixels, so the ratio is free of the
	 * card's `scale-84` and the stage's fit-to-breakpoint scale alike, and the
	 * pointer resolves it against the track's painted box.
	 */
	const knobEnd = () => {
		const track = el.track.offsetWidth;
		return track ? el.knob.offsetWidth / 2 / track : 0;
	};

	const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

	tl
		// ── t=0 · rewind every piece to its "before the beat" state ──────────────
		.set(el.cards, CARDS_DOWN)
		.set(pointer.el, pointer.homeVars())
		.set(pointer.ring, pointer.ringVars())
		.set(el.row, { backgroundColor: fade(rowActive, 0) })
		.set(el.check, { backgroundColor: fade(checkFill, 0), borderColor: checkBorder })
		.set(el.dot, { autoAlpha: 0, scale: 0 })
		.set(el.expand, { height: 0, autoAlpha: 0 })
		.set(el.slider, { scaleX: () => rangeAtKnob(), transformOrigin: "right center" })
		.set(el.knob, { autoAlpha: 0, x: KNOB_OFFSET })
		.set([...handleChars, ...regionChars], CHARS_HIDDEN)
		.set([el.handleCaret, el.regionCaret], { autoAlpha: 0 })
		.set(el.pill, { display: "none" })
		.set(el.apply, { scale: 1 })

		// ── 1 · the three cards land, staggered ──────────────────────────────────
		.add(landCards(el.cards, 0.2), 0.1)

		// ── 2 · cursor travels to the Mega Account checkbox and clicks ───────────
		// Split into its own verbs rather than `pointer.click()` so the selection
		// below can hang off the ring's start, which is the moment of contact.
		.add(pointer.fadeIn(), ">-0.15")
		.add(pointer.moveTo(el.check), "<")
		.add(pointer.press(), ">-0.05")
		.add(pointer.ripple(), "<")

		// the selection takes hold: box fills, row lights up, slider block unfolds
		.to(el.check, { backgroundColor: checkFill, borderColor: fade(checkBorder, 0), duration: 0.25 }, "<0.05")
		.to(el.dot, { autoAlpha: 1, scale: 1, duration: 0.28, ease: "back.out(3)" }, "<0.05")
		.to(el.row, { backgroundColor: rowActive, duration: 0.35 }, "<")
		.to(el.expand, { height: "auto", autoAlpha: 1, duration: 0.5 }, "<")
		// the knob is already sitting at the average cut as the block opens, so there
		// is something to reach for rather than something that arrives on its own
		.to(el.knob, { autoAlpha: 1, duration: 0.25 }, ">-0.25")

		// ── 3 · the hand drags the engagement handle down to the minimum ─────────
		// Cursor, knob and range bar all run on one duration and one ease, so each is
		// the same eased progress applied to its own pair of endpoints and the three
		// stay locked without measuring anything per frame.
		//
		// The cursor's destination is where the knob comes to rest, expressed against
		// the *track* — aiming at a measured element rather than translating by a
		// distance is what makes this survive the card's own `scale-84` on top of the
		// stage scale, since both ends are read in the same painted space.
		//
		// It has to be the track and not the range bar: the bar is being scaled by
		// this same block, so its painted edges are wherever the drag has got to, and
		// a lazily-resolved aim at one of them would read the value at the drag's
		// first frame and leave the hand parked there while the knob went on without it.
		.add(pointer.moveTo(el.knob, { duration: 0.5 }), ">0.15")
		.add(pointer.grab(), ">-0.02")
		.addLabel("pull")
		.add(
			pointer.moveTo(el.track, {
				at: { x: knobEnd, y: 0.5 },
				duration: DRAG,
				ease: "power2.inOut",
			}),
			"pull",
		)
		.to(el.knob, { x: 0, duration: DRAG, ease: "power2.inOut" }, "pull")
		.to(el.slider, { scaleX: 1, duration: DRAG, ease: "power2.inOut" }, "pull")
		.add(pointer.release())

		// ── 4 · cursor moves to the lookalike search bar and types the handle ────
		.add(pointer.moveTo(el.handleField), ">0.2")
		.set(el.handleCaret, { autoAlpha: 1 })
		.add(typeChars(handleChars))
		.add(blinkCaret(el.handleCaret), ">0.15")

		// ── 5 · same again on creator location, brisker ──────────────────────────
		.add(pointer.moveTo(el.regionField), ">-0.4")
		.set(el.handleCaret, { autoAlpha: 0 })
		.set(el.regionCaret, { autoAlpha: 1 })
		.add(typeChars(regionChars, TYPE_SPEED * 1.6))

		// ── 6 · the pick lands as a pill in the list ─────────────────────────────
		.set(el.regionCaret, { autoAlpha: 0 }, ">0.3")
		.set(el.pill, { display: "inline-flex" })
		.fromTo(
			el.pill,
			{ scale: 0.6, autoAlpha: 0, y: 8 },
			{ scale: 1, autoAlpha: 1, y: 0, duration: 0.45, ease: "back.out(2)" },
		)

		// ── 7 · run the search ───────────────────────────────────────────────────
		// The long hop back up to the top bar is the point: it reads the filters the
		// beat just built on the way past, and lands on the button that would run
		// them. Nothing happens after the press — the panel's job was the search, and
		// its results are the next tab's story.
		.add(pointer.moveTo(el.apply), ">0.4")
		.add(pointer.press(), ">-0.05")
		.add(pointer.ripple(), "<")
		.to(el.apply, { scale: 0.95, duration: 0.1 }, "<")
		.to(el.apply, { scale: 1, duration: 0.2, ease: "back.out(2)" })
		.add(pointer.fadeOut(), ">0.35");

	return tl;
}
