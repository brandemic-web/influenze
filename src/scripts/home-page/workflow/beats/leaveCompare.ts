import gsap from "gsap";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 9 — read the comparison down, press Back, reach for share. 9 → 8 is beat 8's
 * swap run the other way, at the same 450ms; the list needs no restoring.
 *
 * Both columns scroll together by one shared distance — the app treats the compare
 * section as a single pane. That distance is the *smaller* of the two ranges, so
 * neither column can run past its own content and leave a gap.
 */

export interface LeaveCompareLayers {
	/** The compare layer being left. */
	from: HTMLElement;
	/** The list-detail layer. */
	to: HTMLElement;
}

/** A compare column: the stats block, and the box clipping it. */
interface Column {
	content: HTMLElement;
	viewport: HTMLElement;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: LeaveCompareLayers) {
	const columns: Column[] = [];
	for (const viewport of from.querySelectorAll<HTMLElement>("[data-wf-compare-scroll]")) {
		const content = viewport.querySelector<HTMLElement>("[data-wf-mediakit-scroll]");
		if (!content) return null;
		columns.push({ content, viewport });
	}

	const el = {
		back: from.querySelector<HTMLElement>("[data-wf-back]"),
		fromBody: from.querySelector<HTMLElement>("[data-wf-panel-body]"),
		toBody: to.querySelector<HTMLElement>("[data-wf-panel-body]"),
		share: to.querySelector<HTMLElement>("[data-wf-share]"),
	};
	if (!el.back || !el.fromBody || !el.toBody || !el.share || !columns.length) return null;

	return { ...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }), columns };
}

export function leaveCompare(layers: LeaveCompareLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	/** How far both columns can travel in step, measured. */
	const range = () =>
		Math.min(...el.columns.map(({ content, viewport }) => Math.max(0, content.offsetHeight - viewport.clientHeight)));

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Wind the layers back first, so the beat is replayable from anywhere.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	}).set(
		el.columns.map(({ content }) => content),
		{ y: 0 }
	);

	// ── read all the way down ────────────────────────────────────────────────
	// Wheel-style under the cursor, and unhurried for beat 4's reason: card 4 is up
	// across this scroll, so the duration is also how long that card is readable.
	tl.add(pointer.moveTo(el.columns[0].viewport, { at: { x: 0.5, y: 0.35 }, duration: 0.6 }), "+=0.2").to(
		el.columns.map(({ content }) => content),
		{ y: () => -range(), duration: 3.4, ease: "power1.inOut" },
		"+=0.1"
	);

	// ── back to the list ─────────────────────────────────────────────────────
	const OUT = 0.22;
	// Card 4 goes out on this mark, so it clears as the cursor sets off for Back
	// rather than sitting over the exit. See workflowCards.ts.
	tl.addLabel("toBack", "+=0.35")
		.add(pointer.moveTo(el.back, { duration: 0.7 }), "toBack")
		.add(pointer.press())
		.addLabel("leave")
		.to(el.fromBody, { opacity: 0, duration: OUT, ease: "power2.in" }, "leave");

	tl.addLabel("swap", `leave+=${OUT}`)
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
		.from(el.toBody, { opacity: 0, duration: 0.23, immediateRender: false }, "swap");

	// ── reach for share ──────────────────────────────────────────────────────
	tl.add(pointer.moveTo(el.share, { duration: 0.65 }), "+=0.3").add(pointer.press(), ">-0.05");

	return tl;
}
