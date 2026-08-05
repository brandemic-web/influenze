import gsap from "gsap";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 4 — the Media Kit tab.
 *
 * Answers beat 3's press on the tab: the underline moves across, the card body
 * changes, the cursor scrolls the media kit down a little, then presses
 * add-to-list beside Enquire. Beat 5 answers that press with the dialog.
 *
 * Screens 4 and 5 are the *same* `CreatorDetail` with a different `tab` prop and
 * different slot content, so this is the cheapest swap in the story: the sidebar,
 * header and identity column are already identical, and only the two tabs and the
 * card body have to be brought into line before the layers change.
 *
 * The tab's active and inactive styling is read back off screen 5's own tabs, so
 * `CreatorDetail` stays the only place those colours are written down.
 */

export interface MediaKitTabLayers {
	/** The About-tab layer being left. */
	from: HTMLElement;
	/** The Media Kit layer. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the profile markup is not there. */
function collect({ from, to }: MediaKitTabLayers) {
	const el = {
		fromAbout: from.querySelector<HTMLElement>('[data-wf-tab="about"]'),
		fromMediaKit: from.querySelector<HTMLElement>('[data-wf-tab="mediaKit"]'),
		fromBody: from.querySelector<HTMLElement>("[data-wf-tab-body]"),
		toAbout: to.querySelector<HTMLElement>('[data-wf-tab="about"]'),
		toMediaKit: to.querySelector<HTMLElement>('[data-wf-tab="mediaKit"]'),
		toBody: to.querySelector<HTMLElement>("[data-wf-tab-body]"),
		mediaKit: to.querySelector<HTMLElement>("[data-wf-mediakit-scroll]"),
		addToList: to.querySelector<HTMLElement>("[data-wf-add-to-list]"),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

/** The two properties that separate a live tab from a dormant one. */
function tabStyle(tab: HTMLElement) {
	const style = getComputedStyle(tab);
	return { borderBottomColor: style.borderBottomColor, color: style.color };
}

export function mediaKitTab(layers: MediaKitTabLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	// Screen 5 already renders both states; borrow them rather than restate them.
	const live = tabStyle(el.toMediaKit);
	const dormant = tabStyle(el.toAbout);

	/** How far the media kit can travel — its own height less the box clipping it. */
	const scrollRange = () => Math.max(0, el.mediaKit.offsetHeight - el.toBody.clientHeight);
	/** How far through the media kit to travel — near the end, but not slammed into it. */
	const SCROLL_FRACTION = 0.85;

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Put the layers back the way beat 3 leaves them first, so this beat is
	// self-contained and the story can be replayed from wherever it stopped.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	}).set(el.mediaKit, { y: 0 });

	// ── the tab switches ─────────────────────────────────────────────────────
	const SWITCH = 0.3;
	tl.addLabel("switch")
		.to(el.fromBody, { opacity: 0, duration: SWITCH }, "switch")
		.to(el.fromAbout, { ...dormant, duration: SWITCH }, "switch")
		.to(el.fromMediaKit, { ...live, duration: SWITCH }, "switch");

	// Swap once the tabs have traded places and the old body is gone.
	tl.addLabel("swap", `switch+=${SWITCH}`)
		.call(
			() => {
				layers.from.removeAttribute("data-wf-active");
				layers.to.setAttribute("data-wf-active", "");
			},
			undefined,
			"swap"
		)
		// Leave the layer we came from as we found it, so a replay starts clean.
		.set(el.fromBody, { opacity: 1 }, "swap")
		.call(
			() => {
				for (const tab of [el.fromAbout, el.fromMediaKit]) {
					tab.style.removeProperty("border-bottom-color");
					tab.style.removeProperty("color");
				}
			},
			undefined,
			"swap"
		)
		.from(el.toBody, { opacity: 0, duration: 0.35, immediateRender: false }, "swap");

	// ── scroll the media kit ─────────────────────────────────────────────────
	// Cursor moves off the tab and into the card first, so the scroll happens under
	// it like a wheel — the same reasoning as the rail scroll in beat 1.
	// The scroll is deliberately unhurried: card 2 is up across it and bows out at
	// `scrolled` below, so this duration is what decides how long that card is
	// readable as well as how the kit reads.
	tl.add(pointer.moveTo(el.toBody, { at: { x: 0.5, y: 0.35 }, duration: 0.55 }), "+=0.25").to(
		el.mediaKit,
		{ y: () => -scrollRange() * SCROLL_FRACTION, duration: 2.4, ease: "power1.inOut" },
		"+=0.1"
	);

	// The card explaining this screen bows out here rather than at the beat's end,
	// so it is gone before the cursor reaches for add-to-list. See workflowCards.ts.
	tl.addLabel("scrolled");

	// ── reach for add-to-list, beside Enquire ────────────────────────────────
	tl.add(pointer.moveTo(el.addToList, { duration: 0.75 }), "+=0.25").add(pointer.press(), ">-0.05");

	return tl;
}
