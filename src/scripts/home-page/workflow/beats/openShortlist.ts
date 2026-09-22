import gsap from "gsap";
import type { Pointer } from "../utils/pointer";

/**
 * The shortlist card is opened from the ShortLists tab.
 *
 * The app routes here — `shortlists/:shortlistId` — so the panel is rebuilt rather
 * than transitioned, and the nav stays put because both screens are My Lists. Only
 * the panel body changes, which is why the card fades out and the rows fade in
 * rather than anything sliding.
 */

export interface OpenShortlistLayers {
	/** The ShortLists home layer. */
	from: HTMLElement;
	/** The shortlist detail layer. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: OpenShortlistLayers) {
	const el = {
		card: from.querySelector<HTMLElement>("[data-wf-list-target]"),
		fromBody: from.querySelector<HTMLElement>("[data-wf-card-body]"),
		toBody: to.querySelector<HTMLElement>("[data-wf-panel-body]"),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

export function openShortlist(layers: OpenShortlistLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Wind the layers back first, so the beat is replayable from anywhere.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	});

	// ── open it ──────────────────────────────────────────────────────────────
	// Aimed at the card's name rather than its portrait grid, which is where a
	// reader's eye is and what the app labels the tap target with.
	const LEAVE = 0.28;
	tl.add(pointer.moveTo(el.card, { at: { y: 0.82 }, duration: 0.7 }), "+=0.25")
		.add(pointer.press(), ">-0.05")
		.addLabel("open")
		.to(el.fromBody, { opacity: 0, duration: LEAVE }, "open");

	tl.addLabel("swap", `open+=${LEAVE}`)
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
		.from(el.toBody, { opacity: 0, y: 10, duration: 0.42, immediateRender: false }, "swap")
		.addLabel("settled");

	return tl;
}
