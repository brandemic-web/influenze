import gsap from "gsap";
import { CREDITS, PROFILED_HANDLE } from "../../../../data/workflowMockup";
import { setCredits, spendCredits } from "../utils/credits";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 7 with the shortlist flow off — Selwyn is opened straight from the results,
 * and the 50-credit unlock is spent on the press, as `openCreator` spends it from
 * the shortlist.
 *
 * Opened from Analyze the app keeps the screen and lays `CreatorDetail` over the
 * results panel, wrapping the rail in `FilterDisableOverlay`. Screen 3 has no dim
 * wrapper, so its search bar and rail are dimmed one by one before the swap, to
 * values read off the arriving layer's own wrapper.
 */

export interface OpenFromResultsLayers {
	/** The results layer being left. */
	from: HTMLElement;
	/** The Analyze-hosted creator detail layer. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: OpenFromResultsLayers) {
	const el = {
		name: from.querySelector<HTMLElement>(`[data-wf-creator="${PROFILED_HANDLE}"] [data-wf-creator-name]`),
		searchBar: from.querySelector<HTMLElement>("[data-wf-searchbar]"),
		rail: from.querySelector<HTMLElement>("[data-wf-rail]"),
		dimmed: to.querySelector<HTMLElement>("[data-wf-dimmed]"),
		detail: to.querySelector<HTMLElement>("[data-wf-detail]"),
		mediaKitTab: to.querySelector<HTMLElement>('[data-wf-tab="mediaKit"]'),
	};
	const parts = from.querySelectorAll<HTMLElement>("[data-wf-results-part]");

	if (!Object.values(el).every(Boolean) || !parts.length) return null;
	return { ...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }), parts };
}

export function openFromResults(layers: OpenFromResultsLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	// Only the opacity is tweened; the blur is set outright. Tailwind builds `filter`
	// from a chain of custom properties that won't interpolate out of `none`, and at
	// 0.1rem it is too slight to see arrive anyway.
	const dim = getComputedStyle(el.dimmed);
	const dimOpacity = Number(dim.opacity) || 1;
	const dimFilter = dim.filter;
	const sidebar = [el.searchBar, el.rail];

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Wind the layers back first, so the beat is replayable from anywhere — the chip
	// too, since it is spent on the layer being left.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
		setCredits(layers.from, CREDITS.afterSearch);
	});

	// ── open the creator, and pay for it ─────────────────────────────────────
	const CLEAR = 0.45;
	tl.add(pointer.moveTo(el.name, { at: { x: 0.4, y: 0.5 }, duration: 0.7 }), "+=0.3")
		.add(pointer.press(), ">-0.05")
		.addLabel("open")
		.call(spendCredits(layers.from, CREDITS.afterSearch, CREDITS.afterProfile), undefined, "open")
		.to(el.parts, { opacity: 0, y: -8, duration: 0.3 }, "open")
		.set(sidebar, { filter: dimFilter }, "open")
		.to(sidebar, { opacity: dimOpacity, duration: CLEAR }, "open");

	// Swap only once both have finished, so neither half is caught mid-way.
	tl.addLabel("swap", `open+=${CLEAR}`)
		.call(
			() => {
				layers.from.removeAttribute("data-wf-active");
				layers.to.setAttribute("data-wf-active", "");
			},
			undefined,
			"swap"
		)
		// Leave the layer we came from as we found it, so a replay starts clean.
		.set(el.parts, { opacity: 1, y: 0 }, "swap")
		.set(sidebar, { opacity: 1, filter: "none" }, "swap")
		.from(el.detail, { opacity: 0, y: 14, duration: 0.5, immediateRender: false }, "swap")
		// Card 3 hangs off this, the same label `openCreator` gives it.
		.addLabel("settled");

	// ── reach for the Media Kit tab ──────────────────────────────────────────
	tl.add(pointer.moveTo(el.mediaKitTab, { duration: 0.7 }), "+=0.35").add(pointer.press(), ">-0.05");

	return tl;
}
