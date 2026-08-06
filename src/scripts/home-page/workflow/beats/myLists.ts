import gsap from "gsap";
import { token } from "../utils/dom";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 6 — confirm the list, close the dialog, cross to My Lists.
 *
 * Three clicks: Add on the story's list row (which settles to "Added"), the
 * dialog's close ✕, then My Lists in the nav.
 *
 * Closing the dialog needs no layer change. Screen 6 renders byte-for-byte what
 * screen 5 renders once its blur, scrim and card are neutralised (see beat 5), so
 * unwinding those three leaves the story sitting on screen 6's layer looking
 * exactly like screen 5 — and the nav inside that backdrop is what the cursor then
 * clicks.
 *
 * The crossing to screen 7 is the story's first real *navigation*, so it is the
 * first swap that cannot be hidden: the two screens share a nav bar and an empty
 * card, but the nav pill is a different shape in each — the active item carries
 * `px16 py8` and the inactive ones carry nothing, so the whole row shifts. That
 * snap is left visible on purpose. It happens on the click that caused it, which
 * is what the app does when the section rebuilds.
 */

export interface MyListsLayers {
	/** The dialog layer being left. */
	from: HTMLElement;
	/** The My Lists layer. */
	to: HTMLElement;
}
function collectAdded(row: HTMLElement | null) {
	const el = {
		portrait: row?.querySelector<HTMLElement>("[data-wf-list-added]") ?? null,
		countIdle: row?.querySelector<HTMLElement>('[data-wf-list-count="idle"]') ?? null,
		countDone: row?.querySelector<HTMLElement>('[data-wf-list-count="done"]') ?? null,
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: MyListsLayers) {
	const row = from.querySelector<HTMLElement>("[data-wf-list-target]");

	const el = {
		add: row?.querySelector<HTMLElement>("[data-wf-add]") ?? null,
		addIdle: row?.querySelector<HTMLElement>('[data-wf-add-label="idle"]') ?? null,
		addDone: row?.querySelector<HTMLElement>('[data-wf-add-label="done"]') ?? null,
		close: from.querySelector<HTMLElement>("[data-wf-modal-close]"),
		backdrop: from.querySelector<HTMLElement>("[data-wf-modal-backdrop]"),
		scrim: from.querySelector<HTMLElement>("[data-wf-modal-scrim]"),
		card: from.querySelector<HTMLElement>("[data-wf-modal-card]"),
		// The nav the cursor uses is the one inside the dialog's backdrop copy.
		navLists: from.querySelector<HTMLElement>('[data-wf-nav="lists"]'),
		fromBody: from.querySelector<HTMLElement>("[data-wf-card-body]"),
		toBody: to.querySelector<HTMLElement>("[data-wf-card-body]"),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

export function myLists(layers: MyListsLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;
	const added = collectAdded(layers.from.querySelector<HTMLElement>("[data-wf-list-target]"));

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Put things back the way beat 5 leaves them, so the beat is self-contained.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.add, { backgroundColor: token("action") })
		.set(el.addIdle, { opacity: 1 })
		.set(el.addDone, { opacity: 0 });

	if (added) {
		tl.set(added.portrait, { opacity: 0, scale: 0.6 })
			.set(added.countIdle, { opacity: 1 })
			.set(added.countDone, { opacity: 0 });
	}

	// ── add the creator to the list ──────────────────────────────────────────
	tl.add(pointer.moveTo(el.add, { duration: 0.7 }))
		.add(pointer.press())
		.addLabel("added")
		// The button settles rather than staying live — it has done its job.
		.to(el.add, { backgroundColor: token("action-muted"), duration: 0.28 }, "added")
		.to(el.addIdle, { opacity: 0, duration: 0.16 }, "added")
		.to(el.addDone, { opacity: 1, duration: 0.22 }, "added+=0.1");

	if (added) {
		tl.to(
			added.portrait,
			{ opacity: 1, scale: 1, duration: 0.34, ease: "back.out(2)", transformOrigin: "center" },
			"added+=0.12"
		)
			.to(added.countIdle, { opacity: 0, duration: 0.16 }, "added+=0.2")
			.to(added.countDone, { opacity: 1, duration: 0.22 }, "added+=0.3");
	}

	// ── close the dialog ─────────────────────────────────────────────────────
	// Unwound in the reverse order it arrived: card first, then the scrim and blur
	// together, so the background comes back as one movement.
	tl.add(pointer.moveTo(el.close, { duration: 0.6 }), "+=0.4")
		.add(pointer.press())
		.addLabel("close")
		.to(el.card, { opacity: 0, duration: 0.22 }, "close")
		.to(el.scrim, { opacity: 0, duration: 0.28 }, "close+=0.06")
		.to(el.backdrop, { filter: "blur(0px)", duration: 0.28, ease: "none" }, "close+=0.06");

	// ── cross to My Lists ────────────────────────────────────────────────────
	const LEAVE = 0.3;
	tl.add(pointer.moveTo(el.navLists, { duration: 0.75 }), "+=0.35")
		.add(pointer.press())
		.addLabel("go")
		.to(el.fromBody, { opacity: 0, duration: LEAVE }, "go");

	// Swap behind an empty card, so only the nav pill visibly changes.
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

	return tl;
}
