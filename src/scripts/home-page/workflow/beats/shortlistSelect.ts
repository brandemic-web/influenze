import gsap from "gsap";
import { SHORTLIST_HANDLES } from "../../../../data/workflowMockup";
import { clearFill, token } from "../utils/dom";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 3 — three rows are ticked in the results and the bulk Add is pressed.
 *
 * Nothing is spent here, and that is the point of the beat: the credits chip sits
 * still while three creators are saved. The app bills on *opening* a creator, so
 * selecting rows and sending them to a shortlist never touches the balance.
 *
 * `Add` is the one `BulkActionButton` that passes `hideWhenEmpty: false`, so it is
 * already on screen at half opacity; ticking is what brings it up and reveals its
 * count, rather than the button appearing from nothing.
 */

export interface ShortlistSelectLayers {
	/** The results layer — the beat works in place, with no swap. */
	screen: HTMLElement;
}

/** One row's checkbox and the tick inside it. */
function collectRow(screen: HTMLElement, handle: string) {
	const row = screen.querySelector<HTMLElement>(`[data-wf-creator="${handle}"]`);
	const box = row?.querySelector<HTMLElement>("[data-wf-check]") ?? null;
	const mark = box?.querySelector<HTMLElement>("svg") ?? null;
	return row && box && mark ? { row, box, mark } : null;
}

/** Every element the beat drives, or null if the results markup is not what we expect. */
function collect({ screen }: ShortlistSelectLayers) {
	const rows = SHORTLIST_HANDLES.map((handle) => collectRow(screen, handle));
	if (rows.some((row) => row === null)) return null;

	const el = {
		add: screen.querySelector<HTMLElement>("[data-wf-results-add]"),
		button: screen.querySelector<HTMLElement>("[data-wf-results-add] [data-wf-bulk-action]"),
		count: screen.querySelector<HTMLElement>("[data-wf-results-add] [data-wf-bulk-count]"),
	};
	if (!el.add || !el.button || !el.count) return null;

	return {
		...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }),
		rows: rows as NonNullable<ReturnType<typeof collectRow>>[],
	};
}

export function shortlistSelect(layers: ShortlistSelectLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Wind the beat back first, so it is replayable from anywhere. The authored
	// state is every box empty and the button held at the app's disabled 50%.
	tl.call(() => {
		for (const { row, box, mark } of el.rows) {
			gsap.set(row, { backgroundColor: token("surface"), borderColor: token("surface-border") });
			gsap.set(box, { backgroundColor: clearFill(token("violet-bright")), borderColor: token("table-label") });
			gsap.set(mark, { opacity: 0 });
		}
	})
		.set(el.button, { opacity: 0.5 })
		.set(el.count, { opacity: 0 });

	// ── tick the three ───────────────────────────────────────────────────────
	// One at a time, each press answered by its own box, so the selection reads as
	// a decision rather than a batch that happens to the list.
	el.rows.forEach(({ row, box, mark }, i) => {
		tl.add(pointer.moveTo(box, { duration: i === 0 ? 0.6 : 0.42 }), i === 0 ? "+=0.2" : "+=0.12")
			.add(pointer.press())
			.addLabel(`ticked${i}`)
			.to(box, { backgroundColor: token("violet-bright"), borderColor: token("violet-bright"), duration: 0.2 }, `ticked${i}`)
			// The card answers the tick too — `isSelected` is one decoration, not two.
			.to(row, { backgroundColor: token("surface-on"), borderColor: token("surface-on-border"), duration: 0.2 }, `ticked${i}`)
			.to(mark, { opacity: 1, duration: 0.18 }, `ticked${i}+=0.06`);

		// The button wakes on the first tick and the count follows it up each time.
		if (i === 0) tl.to(el.button, { opacity: 1, duration: 0.24 }, "ticked0");
		tl.set(el.count, { textContent: String(i + 1) }, `ticked${i}+=0.08`).to(
			el.count,
			{ opacity: 1, duration: 0.2 },
			`ticked${i}+=0.08`
		);
	});

	// ── send them to a shortlist ─────────────────────────────────────────────
	// The press is the only feedback; beat 4 answers it by opening the dialog.
	tl.add(pointer.moveTo(el.button, { duration: 0.65 }), "+=0.35").add(pointer.press(), ">-0.05").addLabel("add");

	return tl;
}
