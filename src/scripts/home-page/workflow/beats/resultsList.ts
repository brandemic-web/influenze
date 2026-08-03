import gsap from "gsap";
import { PROFILED_HANDLE } from "../../../../data/workflowMockup";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 2 — the search runs and the ranked results arrive.
 *
 * Picks up where beat 1 left off, with the cursor still on Apply & Search: the
 * empty state clears, the panel arrives as one piece, the list scrolls a little
 * to show there is more of it, and the cursor opens Justin Joy — the creator
 * screens 4 and 5 profile.
 *
 * Unlike beat 1 this one does change layer, because screen 3's results table is
 * markup screen 1 simply does not have. The swap is hidden rather than
 * cross-faded: by the time it happens the panel is empty and the shell, search
 * bar and filter rail are identical on both layers, so nothing visibly moves.
 *
 * The rail is not touched here at all: beat 1 already scrolled it to
 * `RAIL_TIER_SCROLL`, which is where screen 3 is authored, so it is in the same
 * place on both layers when they swap.
 */

export interface ResultsListLayers {
	/** The layer being left — its empty state clears out before the swap. */
	from: HTMLElement;
	/** The results layer. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the results markup is not there. */
function collect({ from, to }: ResultsListLayers) {
	const scroller = to.querySelector<HTMLElement>("[data-wf-results-scroll]");
	const rows = scroller ? gsap.utils.toArray<HTMLElement>(scroller.children) : [];

	const el = {
		empty: from.querySelector<HTMLElement>("[data-wf-empty]"),
		/** Every direct child of the panel — they reveal together, as one piece. */
		parts: to.querySelectorAll<HTMLElement>("[data-wf-results-part]"),
		scroller,
		profiled: to.querySelector<HTMLElement>(`[data-wf-creator="${PROFILED_HANDLE}"]`),
	};

	if (!el.empty || !el.scroller || !el.profiled || !el.parts.length || rows.length < 2) {
		return null;
	}
	return { ...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }), rows };
}

export function resultsList(layers: ResultsListLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	// One row plus its gap, measured rather than assumed — the canvas is authored
	// in rem and the site's root font-size is fluid.
	const rowPitch = () => el.rows[1].offsetTop - el.rows[0].offsetTop;

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// ── hand the panel over to the results layer ─────────────────────────────
	// Put the layers back the way beat 1 leaves them first, so this beat is
	// self-contained and the story can be replayed from wherever it stopped.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.scroller, { y: 0 })
		.to(el.empty, { opacity: 0, y: -10, duration: 0.28 })
		.call(() => {
			layers.from.removeAttribute("data-wf-active");
			layers.to.setAttribute("data-wf-active", "");
		})
		// Leave the layer we came from exactly as we found it, so a replay starts clean.
		.set(el.empty, { opacity: 1, y: 0 });

	// ── the results arrive ───────────────────────────────────────────────────
	// One reveal, no stagger: the counts, filter chips, column header and rows all
	// come in together, so the panel reads as a single result rather than as parts
	// assembling one after another.
	tl.from(el.parts, { opacity: 0, y: 8, duration: 0.45, immediateRender: false });

	// ── a little scroll through the results ──────────────────────────────────
	// Cursor moves over the list first, so the scroll happens under it like a wheel.
	tl.add(pointer.moveTo(el.scroller, { at: { x: 0.5, y: 0.35 }, duration: 0.55 }), "+=0.2")
		.to(el.scroller, { y: () => -rowPitch() * 1.3, duration: 0.9, ease: "power2.inOut" }, "+=0.1");

	// ── open Justin Joy ──────────────────────────────────────────────────────
	// Aimed at the name rather than the row's centre, which is where the metrics
	// are. Resolved after the scroll, so it follows the row to its new position.
	//
	// The press is the only feedback: the app's row hover and pressed states are
	// not in `lib` anywhere I could check, and beat 3 opening the profile is the
	// real answer to the click.
	tl.add(pointer.moveTo(el.profiled, { at: { x: 0.3 }, duration: 0.6 }), "+=0.1").add(pointer.press(), ">-0.05");

	return tl;
}
