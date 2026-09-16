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

/** One creator row — the card, its tick box and the mark, all of which change. */
interface Tick {
	card: HTMLElement;
	box: HTMLElement;
	mark: HTMLElement;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: ListDetailLayers) {
	const ticks: Tick[] = [];
	for (const handle of COMPARED) {
		const card = to.querySelector<HTMLElement>(`[data-wf-creator="${handle}"]`);
		const box = card?.querySelector<HTMLElement>("[data-wf-check]") ?? null;
		const mark = box?.querySelector<HTMLElement>("svg") ?? null;
		if (!card || !box || !mark) return null;
		ticks.push({ card, box, mark });
	}

	const el = {
		card: from.querySelector<HTMLElement>("[data-wf-list-target]"),
		fromBody: from.querySelector<HTMLElement>("[data-wf-card-body]"),
		toBody: to.querySelector<HTMLElement>("[data-wf-card-body]"),
		compare: to.querySelector<HTMLElement>("[data-wf-compare]"),
		/** Always on screen — it only lights up with the selection. */
		pill: to.querySelector<HTMLElement>("[data-wf-actions-pill]"),
		/** The "N Selected" pill, which is genuinely absent until then. */
		selected: to.querySelector<HTMLElement>("[data-wf-selected-pill]"),
	};
	if (!el.card || !el.fromBody || !el.toBody || !el.compare || !el.pill || !el.selected || !ticks.length) {
		return null;
	}

	// Every row and tick on the screen, not just the two the story uses — all start off.
	const allCards = gsap.utils.toArray<HTMLElement>(to.querySelectorAll("[data-wf-creator]"));
	const allBoxes = gsap.utils.toArray<HTMLElement>(to.querySelectorAll("[data-wf-check]"));
	const allMarks = allBoxes.map((box) => box.querySelector("svg")).filter(Boolean) as unknown as HTMLElement[];
	// Inline controls that only exist while something is selected — Export's count.
	const selection = gsap.utils.toArray<HTMLElement>(to.querySelectorAll("[data-wf-selection]"));
	// The pill's own actions, greyed together rather than one disabled state each.
	const actions = gsap.utils.toArray<HTMLElement>(el.pill.children);

	return {
		...(el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }),
		ticks,
		allCards,
		allBoxes,
		allMarks,
		selection,
		actions,
	};
}

export function listDetail(layers: ListDetailLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	/**
	 * A tick going on: the box fills and the card lifts with it — `isSelected` is one
	 * decoration in the app, not a box that changes and a card that does not — then
	 * the mark lands in the box.
	 */
	const tickOn = ({ card, box, mark }: Tick) =>
		gsap
			.timeline()
			.to(box, {
				borderColor: token("violet-bright"),
				backgroundColor: token("violet-bright"),
				duration: 0.2,
			})
			.to(
				card,
				{ backgroundColor: token("surface-on"), borderColor: token("surface-on-border"), duration: 0.2 },
				"<"
			)
			.to(mark, { opacity: 1, duration: 0.16 }, "-=0.08");

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// ── wind the list back to untouched ──────────────────────────────────────
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.allCards, { backgroundColor: token("surface"), borderColor: token("surface-border") })
		.set(el.allBoxes, { borderColor: token("table-label"), backgroundColor: "transparent" })
		.set(el.allMarks, { opacity: 0 })
		.set(el.selection, { display: "none" })
		.set(el.pill, { backgroundColor: token("select-pill"), borderColor: "transparent" })
		.set(el.actions, { opacity: 0.5 })
		.set(el.selected, { display: "none" });

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

	// Compare needs two, so the selection UI arrives with the second tick: the pill
	// lights up where it stands, the count pill scales in the way the app's
	// `AnimatedScaleFadeSwitcher` brings it.
	tl.addLabel("selected")
		.to(el.pill, { backgroundColor: token("io-pill"), borderColor: token("io-pill-on"), duration: 0.28 }, "selected")
		.to(el.actions, { opacity: 1, duration: 0.28 }, "selected")
		.set(el.selected, { display: "flex", opacity: 0, scale: 0.8 }, "selected")
		.to(el.selected, { opacity: 1, scale: 1, duration: 0.3 }, "selected")
		.set(el.selection, { display: "inline", opacity: 0 }, "selected")
		.to(el.selection, { opacity: 1, duration: 0.28 }, "selected");

	// ── press Compare ────────────────────────────────────────────────────────
	tl.add(pointer.moveTo(el.compare, { duration: 0.6 }), "+=0.3").add(pointer.press(), ">-0.05");

	return tl;
}
