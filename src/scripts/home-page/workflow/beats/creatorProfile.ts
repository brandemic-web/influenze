import gsap from "gsap";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 3 — the creator's profile opens.
 *
 * Answers beat 2's press on Justin Joy: the results table clears, the sidebar
 * dims and blurs behind the profile the way the app's `FilterDisableOverlay`
 * does, the detail rises into the panel, and the cursor reaches the Media Kit tab
 * and presses it. Beat 4 answers that press by switching the tab.
 *
 * Same hidden layer swap as beat 2 — the panel is empty on both sides by the time
 * it happens — with one addition. Screen 4 dims its whole sidebar, so screen 3's
 * search bar and rail have to be dimmed to match *before* the swap, or the
 * sidebar would snap. The target opacity and blur are read back off screen 4's
 * own dimmed wrapper rather than restated here, so `DimmedFilterSidebar` stays the one
 * place those values live.
 *
 * The rail itself never moves: beat 1 scrolled it to `RAIL_TIER_SCROLL` and
 * screens 3 and 4 are both authored there.
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

	// Screen 4 dims one wrapper; screen 3 has no wrapper, so its two halves are
	// dimmed individually. That looks the same because they do not overlap.
	//
	// Only the opacity is tweened. The blur is applied outright, because Tailwind
	// builds `filter` out of a chain of custom properties that does not interpolate
	// dependably from `none` — and at 0.1rem it is far too slight to see arrive.
	const dim = getComputedStyle(el.dimmed);
	const dimOpacity = Number(dim.opacity) || 1;
	const dimFilter = dim.filter;
	const sidebar = [el.searchBar, el.rail];

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// ── the results give way to the profile ──────────────────────────────────
	// Put the layers back the way beat 2 leaves them first, so this beat is
	// self-contained and the story can be replayed from wherever it stopped.
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
		// The profile is fully up here. Card 2 hangs off this rather than off `swap`:
		// arriving with the panel made it read as part of the product UI instead of
		// as something laid over it.
		.addLabel("settled");

	// ── reach for the Media Kit tab ──────────────────────────────────────────
	tl.add(pointer.moveTo(el.mediaKitTab, { duration: 0.7 }), "+=0.35").add(pointer.press(), ">-0.05");

	return tl;
}
