import gsap from "gsap";
import { CREDITS, PROFILED_HANDLE } from "../../../../data/workflowMockup";
import { setCredits, spendCredits } from "../utils/credits";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 2 — the search runs and the ranked results arrive, then the cursor opens
 * the profiled creator. The 1 → 3 layer swap is hidden, not cross-faded: the panel
 * is empty and the shell, search bar and rail match on both sides.
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
	// Wind the layers back first, so the beat is replayable from anywhere.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
		setCredits(layers.to, CREDITS.afterSearch);
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
	// One reveal, no stagger — the panel should read as a single result, not as
	// parts assembling one after another.
	tl.from(el.parts, { opacity: 0, y: 8, duration: 0.45, immediateRender: false });

	// ── a look down the results, and back ────────────────────────────────────
	// Wheel-style scroll under a parked cursor. It returns to the top first: the
	// press below aims at a row, which a scrolled list would slide out from under it.
	tl.add(pointer.moveTo(el.scroller, { at: { x: 0.5, y: 0.35 }, duration: 0.55 }), "+=0.2")
		.to(el.scroller, { y: () => -rowPitch() * 1.3, duration: 0.9, ease: "power2.inOut" }, "+=0.1")
		.to(el.scroller, { y: 0, duration: 0.7, ease: "power2.inOut" }, "+=0.4");

	// ── open the profiled creator ────────────────────────────────────────────
	// Aimed at the name, not the row centre (metrics). The press is the only
	// feedback — the app has no row hover state, and beat 3 answers the click.
	tl.add(pointer.moveTo(el.profiled, { at: { x: 0.3 }, duration: 0.6 }), "+=0.1")
		.add(pointer.press(), ">-0.05")
		.call(spendCredits(layers.to, CREDITS.afterSearch, CREDITS.afterProfile));

	return tl;
}
