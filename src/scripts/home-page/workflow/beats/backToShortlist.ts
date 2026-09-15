import gsap from "gsap";
import { PROFILED_HANDLE } from "../../../../data/workflowMockup";
import { token } from "../utils/dom";
import type { Pointer } from "../utils/pointer";

/**
 * Back out of the creator, into the shortlist — now with the unlock showing.
 *
 * The layer returned to is a second copy of the shortlist rather than the one the
 * story left, because two things have changed that no tween could fake: the Media
 * Kit column has a filled cell where the row was blank, and the balance is 50 lower.
 * Both are authored into it; this beat only has to reveal the cell, so the column
 * visibly becomes the thing the 50 credits bought.
 *
 * The row is ticked at the same time, which is the app's own behaviour — coming back
 * from a creator leaves them selected — and sets up the promote that follows.
 */

export interface BackToShortlistLayers {
	/** The creator detail layer being left. */
	from: HTMLElement;
	/** The shortlist layer, authored unlocked. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: BackToShortlistLayers) {
	const row = to.querySelector<HTMLElement>(`[data-wf-creator="${PROFILED_HANDLE}"]`);

	const el = {
		back: from.querySelector<HTMLElement>("[data-wf-detail] [data-wf-back]"),
		detail: from.querySelector<HTMLElement>("[data-wf-detail]"),
		toBody: to.querySelector<HTMLElement>("[data-wf-panel-body]"),
		mediaKit: row?.querySelector<HTMLElement>("[data-wf-mkit]") ?? null,
		box: row?.querySelector<HTMLElement>("[data-wf-check]") ?? null,
	};
	const mark = el.box?.querySelector<HTMLElement>("svg") ?? null;

	return Object.values(el).every(Boolean) && mark
		? { ...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }), mark }
		: null;
}

export function backToShortlist(layers: BackToShortlistLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Wind the layers back first, so the beat is replayable from anywhere.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.mediaKit, { opacity: 0 })
		.set(el.box, { backgroundColor: "transparent", borderColor: token("table-label") })
		.set(el.mark, { opacity: 0 });

	// ── press Back ───────────────────────────────────────────────────────────
	const LEAVE = 0.28;
	tl.add(pointer.moveTo(el.back, { duration: 0.75 }), "+=0.4")
		.add(pointer.press(), ">-0.05")
		.addLabel("back")
		.to(el.detail, { opacity: 0, duration: LEAVE }, "back");

	tl.addLabel("swap", `back+=${LEAVE}`)
		.call(
			() => {
				layers.from.removeAttribute("data-wf-active");
				layers.to.setAttribute("data-wf-active", "");
			},
			undefined,
			"swap"
		)
		// Leave the layer we came from as we found it, so a replay starts clean.
		.set(el.detail, { opacity: 1 }, "swap")
		.from(el.toBody, { opacity: 0, duration: 0.36, immediateRender: false }, "swap");

	// ── the unlock shows itself ──────────────────────────────────────────────
	// Held back until the rows have settled, so it arrives as a change to the list
	// rather than as part of the list appearing.
	tl.addLabel("unlocked", "+=0.25")
		.from(el.mediaKit, { y: 4, duration: 0.4, immediateRender: false }, "unlocked")
		.to(el.mediaKit, { opacity: 1, duration: 0.4 }, "unlocked")
		.to(el.box, { backgroundColor: token("violet-bright"), borderColor: token("violet-bright"), duration: 0.2 }, "unlocked+=0.15")
		.to(el.mark, { opacity: 1, duration: 0.18 }, "unlocked+=0.21");

	return tl;
}
