import gsap from "gsap";
import { COMPARED_HANDLES } from "../../../../data/workflowMockup";
import { token } from "../utils/dom";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 7 — open the list, tick the two creators the compare screen shows, press
 * Compare. Screen 8's static frame is the *selected* state, so this winds it back
 * to an untouched list first (same as beat 1 with the filter rail). 7 → 8 is
 * section-internal, so unlike beat 6 there is no nav pill to snap.
 */

/** Taken from the data, not the rows' `checked` flags, so tick order and column
 *  order can never disagree. */
const COMPARED = COMPARED_HANDLES;

export interface ListDetailLayers {
	/** The My Lists layer being left. */
	from: HTMLElement;
	/** The list-detail layer. */
	to: HTMLElement;
}

/** One creator row's tick box and its mark. */
interface Tick {
	box: HTMLElement;
	mark: HTMLElement;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: ListDetailLayers) {
	const ticks: Tick[] = [];
	for (const handle of COMPARED) {
		const box = to.querySelector<HTMLElement>(`[data-wf-creator="${handle}"] [data-wf-check]`);
		const mark = box?.querySelector<HTMLElement>("svg") ?? null;
		if (!box || !mark) return null;
		ticks.push({ box, mark });
	}

	const el = {
		card: from.querySelector<HTMLElement>("[data-wf-list-target]"),
		fromBody: from.querySelector<HTMLElement>("[data-wf-card-body]"),
		toBody: to.querySelector<HTMLElement>("[data-wf-card-body]"),
		compare: to.querySelector<HTMLElement>("[data-wf-compare]"),
	};
	if (!el.card || !el.fromBody || !el.toBody || !el.compare || !ticks.length) return null;

	// Every tick on the screen, not just the two the story uses — they all start off.
	const allBoxes = gsap.utils.toArray<HTMLElement>(to.querySelectorAll("[data-wf-check]"));
	const allMarks = allBoxes.map((box) => box.querySelector("svg")).filter(Boolean) as unknown as HTMLElement[];
	// Controls that only exist while something is selected.
	const selection = gsap.utils.toArray<HTMLElement>(to.querySelectorAll("[data-wf-selection]"));
	if (!selection.length) return null;

	return { ...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }), ticks, allBoxes, allMarks, selection };
}

export function listDetail(layers: ListDetailLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	/** A tick going on: the box fills, then the mark lands in it. */
	const tickOn = ({ box, mark }: Tick) =>
		gsap
			.timeline()
			.to(box, {
				borderColor: token("violet-bright"),
				backgroundColor: token("violet-bright"),
				duration: 0.2,
			})
			.to(mark, { opacity: 1, duration: 0.16 }, "-=0.08");

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// ── wind the list back to untouched ──────────────────────────────────────
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.allBoxes, { borderColor: token("table-label"), backgroundColor: "transparent" })
		.set(el.allMarks, { opacity: 0 })
		.set(el.selection, { display: "none" });

	// ── open the list ────────────────────────────────────────────────────────
	const LEAVE = 0.3;
	tl.add(pointer.moveTo(el.card, { at: { y: 0.35 }, duration: 0.8 }))
		.add(pointer.press())
		.addLabel("go")
		.to(el.fromBody, { opacity: 0, duration: LEAVE }, "go");

	tl.addLabel("swap", `go+=${LEAVE}`)
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
		.from(el.toBody, { opacity: 0, duration: 0.4, immediateRender: false }, "swap");

	// ── tick the two creators ────────────────────────────────────────────────
	el.ticks.forEach((tick, i) => {
		tl.add(pointer.moveTo(tick.box, { duration: i === 0 ? 0.7 : 0.55 }), i === 0 ? "+=0.3" : "+=0.25")
			.add(pointer.press())
			.add(tickOn(tick), "-=0.08");
	});

	// Compare needs two, so the whole selection group arrives with the second tick.
	tl.set(el.selection, { display: "flex", opacity: 0 }).to(el.selection, { opacity: 1, duration: 0.28 });

	// ── press Compare ────────────────────────────────────────────────────────
	tl.add(pointer.moveTo(el.compare, { duration: 0.6 }), "+=0.3").add(pointer.press(), ">-0.05");

	return tl;
}
