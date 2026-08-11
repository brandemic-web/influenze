import gsap from "gsap";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 3 — the profile opens: results clear, the sidebar dims (the app's
 * `FilterDisableOverlay`), the detail rises, and the cursor presses Media Kit.
 *
 * Screen 3 has no dim wrapper, so its search bar and rail are dimmed individually
 * before the swap. Values are read off screen 4's own wrapper, not restated here.
 */

export interface CreatorProfileLayers {
	/** The results layer being left. */
	from: HTMLElement;
	/** The profile layer. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the profile markup is not there. */
function collect({ from, to }: CreatorProfileLayers) {
	const el = {
		parts: from.querySelectorAll<HTMLElement>("[data-wf-results-part]"),
		searchBar: from.querySelector<HTMLElement>("[data-wf-searchbar]"),
		rail: from.querySelector<HTMLElement>("[data-wf-rail]"),
		dimmed: to.querySelector<HTMLElement>("[data-wf-dimmed]"),
		detail: to.querySelector<HTMLElement>("[data-wf-detail]"),
		mediaKitTab: to.querySelector<HTMLElement>('[data-wf-tab="mediaKit"]'),
	};

	if (!el.searchBar || !el.rail || !el.dimmed || !el.detail || !el.mediaKitTab || !el.parts.length) {
		return null;
	}
	return el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> };
}

export function creatorProfile(layers: CreatorProfileLayers, pointer: Pointer) {
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

	// ── the results give way to the profile ──────────────────────────────────
	// Wind the layers back first, so the beat is replayable from anywhere.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	});

	const CLEAR = 0.45;
	tl.addLabel("clear")
		.to(el.parts, { opacity: 0, y: -8, duration: 0.3 }, "clear")
		.set(sidebar, { filter: dimFilter }, "clear")
		.to(sidebar, { opacity: dimOpacity, duration: CLEAR }, "clear");

	// Swap only once both have finished, so neither half is caught mid-way.
	tl.addLabel("swap", `clear+=${CLEAR}`)
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
		// ── the profile rises into the panel ─────────────────────────────────
		.from(el.detail, { opacity: 0, y: 14, duration: 0.5, immediateRender: false }, "swap")
		// Card 2 hangs off this, not `swap` — arriving with the panel made it read as
		// part of the product UI rather than as something laid over it.
		.addLabel("settled");

	// ── reach for the Media Kit tab ──────────────────────────────────────────
	tl.add(pointer.moveTo(el.mediaKitTab, { duration: 0.7 }), "+=0.35").add(pointer.press(), ">-0.05");

	return tl;
}
