import gsap from "gsap";
import { CREDITS, PROFILED_HANDLE } from "../../../../data/workflowMockup";
import { setCredits, spendCredits } from "../utils/credits";
import type { Pointer } from "../utils/pointer";

/**
 * A creator is opened from inside the shortlist — the story's one unlock.
 *
 * This is where the 50 credits go, and the chip ticks on the press rather than on
 * arrival because that is what the app does: `CreatorDetail` watches
 * `mediaKitByProfileKeyPod` as it builds, so the charge is a consequence of opening
 * the panel, not of anything inside it.
 *
 * `shortlist_details.dart` swaps the shortlist's body for the detail inside the same
 * shell, so nothing outside the panel moves — no sidebar to dim, unlike opening a
 * creator from Analyze. The rows clear, the detail rises in their place.
 */

export interface OpenCreatorLayers {
	/** The shortlist layer being left. */
	from: HTMLElement;
	/** The creator detail layer. */
	to: HTMLElement;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: OpenCreatorLayers) {
	const el = {
		row: from.querySelector<HTMLElement>(`[data-wf-creator="${PROFILED_HANDLE}"]`),
		fromBody: from.querySelector<HTMLElement>("[data-wf-panel-body]"),
		detail: to.querySelector<HTMLElement>("[data-wf-detail]"),
		mediaKitTab: to.querySelector<HTMLElement>('[data-wf-tab="mediaKit"]'),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

export function openCreator(layers: OpenCreatorLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Wind the layers back first, so the beat is replayable from anywhere. The chip
	// goes with them: this beat is the one that spends, and it spends on the layer it
	// is leaving, so a replay would otherwise reveal the shortlist already 50 down
	// and only correct itself when the press runs the countdown again.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
		setCredits(layers.from, CREDITS.afterSearch);
	});

	// ── open the creator, and pay for it ─────────────────────────────────────
	// Aimed at the name, not the row centre (metrics). The chip is ticked on the
	// layer being left, so the swap lands on a balance that already reads right.
	const LEAVE = 0.3;
	tl.add(pointer.moveTo(el.row, { at: { x: 0.3, y: 0.32 }, duration: 0.7 }), "+=0.3")
		.add(pointer.press(), ">-0.05")
		.addLabel("open")
		.call(spendCredits(layers.from, CREDITS.afterSearch, CREDITS.afterProfile), undefined, "open")
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
		.from(el.detail, { opacity: 0, y: 14, duration: 0.5, immediateRender: false }, "swap")
		// The vetting card hangs off this, not `swap` — arriving with the panel made it
		// read as part of the product UI rather than as something laid over it.
		.addLabel("settled");

	// ── reach for the Media Kit tab ──────────────────────────────────────────
	tl.add(pointer.moveTo(el.mediaKitTab, { duration: 0.7 }), "+=0.35").add(pointer.press(), ">-0.05");

	return tl;
}
