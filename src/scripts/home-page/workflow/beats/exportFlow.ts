import gsap from "gsap";
import { EXPORT_ADDS } from "../../../../data/workflowMockup";
import { clearFill, token } from "../utils/dom";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 14 — export the two creators the compare screen just held.
 *
 * It runs on the selection beat 11 made, which is the whole reason it sits here:
 * the toolbar's Export already reads `Export 2`, so the dialog opens over a
 * decision the story has already shown rather than one it has to explain.
 *
 * Unlike the add-to dialog this beat presses its own control, because the beat
 * before it ends by leaving compare rather than by opening anything. It then
 * **closes** the dialog, which nothing else in the story does — every other one
 * leaves by the screen changing underneath it.
 *
 * It also owns the reach for Share that `leaveCompare` used to end on, so the
 * story still arrives at the share modal mid-gesture.
 */

/** Which columns get ticked, and in which order — the data owns both. */
const ADDS = EXPORT_ADDS;

export interface ExportFlowLayers {
	/** The list-detail layer the story is standing on. */
	from: HTMLElement;
	/** The dialog layer, which carries its own blurred copy of the list. */
	dialog: HTMLElement;
	/** The list again, with the header's export popover open. */
	done: HTMLElement;
}

/** One column: the row to press, its box, its tick, and the Selected row it adds. */
interface Column {
	row: HTMLElement;
	box: HTMLElement;
	mark: HTMLElement;
	picked: HTMLElement;
}

function collectColumn(dialog: HTMLElement, label: string): Column | null {
	const row = dialog.querySelector<HTMLElement>(`[data-wf-export-row="${label}"]`);
	const box = row?.querySelector<HTMLElement>("[data-wf-export-check]") ?? null;
	const mark = box?.querySelector<HTMLElement>("svg") ?? null;
	const picked = dialog.querySelector<HTMLElement>(`[data-wf-export-picked="${label}"]`);
	return row && box && mark && picked ? { row, box, mark, picked } : null;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, dialog, done }: ExportFlowLayers) {
	const columns = ADDS.map((label) => collectColumn(dialog, label));
	if (columns.some((column) => column === null)) return null;

	const el = {
		trigger: from.querySelector<HTMLElement>("[data-wf-export]"),
		backdrop: dialog.querySelector<HTMLElement>("[data-wf-modal-backdrop]"),
		scrim: dialog.querySelector<HTMLElement>("[data-wf-modal-scrim]"),
		card: dialog.querySelector<HTMLElement>("[data-wf-modal-card]"),
		scroll: dialog.querySelector<HTMLElement>("[data-wf-export-scroll]"),
		download: dialog.querySelector<HTMLElement>("[data-wf-export-download]"),
		note: done.querySelector<HTMLElement>("[data-wf-export-note]"),
		share: done.querySelector<HTMLElement>("[data-wf-share]"),
	};
	// The clipping box the run is translated inside — what the cursor stands over
	// while the list moves, and what a scroll distance is measured against.
	const view = el.scroll?.parentElement ?? null;
	if (!Object.values(el).every(Boolean) || !view) return null;

	return {
		...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }),
		view,
		columns: columns as Column[],
	};
}

export function exportFlow(layers: ExportFlowLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	/**
	 * How far to scroll for a row to sit in the middle of the clipped run. Measured
	 * at play time, not authored: the list is a real flow, so a column added to the
	 * data moves every row below it and this still lands.
	 *
	 * `row.offsetTop` is relative to the run, **not** to the dialog card: the run
	 * carries a transform the moment the wind-back sets `y`, and a transformed
	 * element becomes the `offsetParent` of everything inside it. Measure this on an
	 * idle page — before any beat has run — and the card answers instead, which reads
	 * like ~190px of header and padding wrongly baked into the distance. It is not;
	 * subtracting the run's own offset here scrolls almost nowhere.
	 */
	const scrollFor = (row: HTMLElement) => {
		const view = el.view;
		const travel = el.scroll.offsetHeight - view.offsetHeight;
		if (travel <= 0) return 0;
		const wanted = row.offsetTop - (view.offsetHeight - row.offsetHeight) / 2;
		return -gsap.utils.clamp(0, travel, wanted);
	};

	const blurred = getComputedStyle(el.backdrop).filter;
	const CLEAR = "blur(0px)";

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// ── wind back ────────────────────────────────────────────────────────────
	// The dialog is authored in the state it is left in, so a replay has to undo
	// every tick, the hover under the pointer and the scroll.
	tl.call(() => {
		layers.dialog.removeAttribute("data-wf-active");
		layers.done.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.scroll, { y: 0 })
		.set(el.note, { opacity: 0, scale: 0.9 });

	for (const { row, box, mark, picked } of el.columns) {
		tl.set(row, { backgroundColor: clearFill(token("list-row")) })
			.set(box, { borderColor: token("control-border"), backgroundColor: clearFill(token("violet-bright")) })
			.set(mark, { opacity: 0 })
			.set(picked, { display: "none" });
	}

	// ── press Export ─────────────────────────────────────────────────────────
	tl.add(pointer.moveTo(el.trigger, { duration: 0.75 }), "+=0.2").add(pointer.press());

	// ── the dialog opens, swap-first ─────────────────────────────────────────
	// Same shape as the add-to dialog: with the blur off, the scrim clear and the
	// card hidden, the two layers are identical and the swap cannot be seen.
	tl.set(el.backdrop, { filter: CLEAR })
		.set(el.scrim, { opacity: 0 })
		.set(el.card, { opacity: 0 })
		.call(() => {
			layers.from.removeAttribute("data-wf-active");
			layers.dialog.setAttribute("data-wf-active", "");
		})
		.addLabel("open")
		.to(el.backdrop, { filter: blurred, duration: 0.26, ease: "none" }, "open")
		.to(el.scrim, { opacity: 1, duration: 0.26 }, "open")
		.to(el.card, { opacity: 1, duration: 0.32 }, "open+=0.08");

	// ── tick the two columns ─────────────────────────────────────────────────
	// The list scrolls to each one first, because they are thirteen rows apart in
	// the app's alphabetical run and never share a screenful.
	//
	// The scroll has to *finish* before the cursor sets off. `moveTo` resolves its
	// target when the tween starts and then glides to that fixed point, so a cursor
	// launched at a row mid-scroll lands where the row was, not where it stops.
	el.columns.forEach(({ row, box, mark, picked }, i) => {
		// The cursor reaches the list before the list moves — a wheel scroll happens
		// under the pointer, and on the first column the pointer is still out on the
		// toolbar where it pressed Export. For the second it is already standing on
		// the row it has just ticked, so it only has to wait.
		if (i === 0) tl.add(pointer.moveTo(el.view, { at: { y: 0.6 }, duration: 0.7 }), "+=0.3");

		tl.to(el.scroll, { y: () => scrollFor(row), duration: 0.85 }, i === 0 ? ">0.25" : "+=0.5")
			.add(pointer.moveTo(row, { duration: 0.6 }), ">0.2")
			// `_HoverRow` fills *as the cursor lands*, not on the way. Lighting the row
			// up a quarter-second early reads as a click of its own, and then the tick
			// that follows reads as a second one.
			.to(row, { backgroundColor: token("list-row"), duration: 0.12 }, ">-0.12")
			.addLabel(`press${i}`, "+=0.08")
			.add(pointer.press(), `press${i}`)
			// The tick lands as the finger bottoms out — `press` dips for 0.096s and
			// takes 0.24s all in, so hanging the checkbox off the *end* of it reads as
			// the row answering late.
			.to(box, { borderColor: token("violet-bright"), backgroundColor: token("violet-bright"), duration: 0.18 }, `press${i}+=0.1`)
			.to(mark, { opacity: 1, duration: 0.14 }, `press${i}+=0.16`)
			// The Selected pane is a plain column, so the new row lands at the end.
			.set(picked, { display: "flex", opacity: 0, y: -6 }, `press${i}+=0.14`)
			.to(picked, { opacity: 1, y: 0, duration: 0.3 }, `press${i}+=0.14`);
	});

	// ── download ─────────────────────────────────────────────────────────────
	// `.csv` is already the live chip, so the story leaves it alone: pressing a
	// control that is already on reads as a misfire, not as a choice.
	tl.add(pointer.moveTo(el.download, { duration: 0.7 }), "+=0.6").add(pointer.press(), "+=0.15");

	// ── the dialog closes onto the finished job ──────────────────────────────
	tl.addLabel("close", "+=0.15")
		.to(el.card, { opacity: 0, duration: 0.22 }, "close")
		.to(el.scrim, { opacity: 0, duration: 0.26 }, "close")
		.to(el.backdrop, { filter: CLEAR, duration: 0.26, ease: "none" }, "close")
		.call(() => {
			layers.dialog.removeAttribute("data-wf-active");
			layers.done.setAttribute("data-wf-active", "");
		})
		// The popover is not a toast: finishing a job opens the header's own panel,
		// so it arrives the way that overlay does, scaled up out of the button.
		.to(el.note, { opacity: 1, scale: 1, duration: 0.3 }, "+=0.1")
		.addLabel("exported");

	// ── hand the story to Share ──────────────────────────────────────────────
	// The popover sits directly over the panel header, Share included, so it has to
	// be dismissed *before* the cursor sets off — pressing Share underneath it hides
	// the one thing the viewer is meant to watch. Clicking away is what closes it in
	// the app too, so the order is the app's as much as it is legibility.
	tl.to(el.note, { opacity: 0, scale: 0.95, duration: 0.3 }, "+=1.8")
		.add(pointer.moveTo(el.share, { duration: 0.8 }), "+=0.3")
		.add(pointer.press(), "+=0.15");

	return tl;
}
