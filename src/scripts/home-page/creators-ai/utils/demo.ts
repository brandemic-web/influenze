import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PANEL_DONE, PANEL_ENTER } from "../../../creators-ai";
import { createPointer, type Pointer } from "./pointer";

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared harness for the beats that play inside the CreatorsAI tab panels. Each
 * beat owns a paused timeline; the harness resolves the panel's cursor, handles
 * reduced motion, and replays the timeline whenever its tab is selected.
 *
 * Every panel's markup renders in its *settled* state so the section still looks
 * right without JS. A beat rewinds its pieces to the "before" state in a block of
 * `set()`s at position 0 and plays forward from there, which is also what makes
 * the beats replayable.
 *
 * A beat returns nothing if the markup it expects is not there, and is skipped —
 * the panel then simply stays on its settled frame.
 */

/** Seconds of quiet after the last resize event before timelines re-measure. */
const RESIZE_DEBOUNCE = 0.2;

/**
 * Every registered panel and its timeline, so resize is served by one debounced
 * listener rather than one per panel. Astro view transitions replace the DOM and
 * re-run `init()`, so entries are pruned by `isConnected` on both registration
 * and resize — otherwise each navigation would leak a timeline over dead nodes.
 */
const registered = new Set<{ panel: HTMLElement; tl: gsap.core.Timeline }>();
let resizeBound = false;

function prune() {
	for (const entry of registered) {
		if (!entry.panel.isConnected) {
			entry.tl.kill();
			registered.delete(entry);
		}
	}
}

function bindResize() {
	if (resizeBound) return;
	resizeBound = true;

	let pending: gsap.core.Tween | null = null;
	window.addEventListener("resize", () => {
		pending?.kill();
		// `invalidate()` drops the cached from/to values so the next play re-reads
		// the pointer's targets at the new stage scale.
		pending = gsap.delayedCall(RESIZE_DEBOUNCE, () => {
			prune();
			for (const { tl } of registered) tl.invalidate();
		});
	});
}

export interface DemoContext {
	panel: HTMLElement;
	/** The scaled collage stage the panel is laid out on. */
	stage: HTMLElement;
	/**
	 * The panel's scripted cursor, or null where its markup carries none — a beat
	 * that needs one guards on it the same way it guards on any other hook.
	 */
	pointer: Pointer | null;
}

export type BeatBuilder = (ctx: DemoContext) => gsap.core.Timeline | undefined;

export interface PanelDemoOptions {
	/** Play as soon as the section scrolls into view (only the default tab). */
	autoPlay?: boolean;
}

/**
 * Wires a panel's beat up to the tab that controls it. `build` returns the
 * timeline, or nothing to opt out.
 */
export function registerPanelDemo(
	panelId: string,
	build: BeatBuilder,
	{ autoPlay = false }: PanelDemoOptions = {},
) {
	function init() {
		const panel = document.getElementById(panelId);
		if (!panel || panel.dataset.demoReady === "true") return;

		const stage = panel.parentElement;
		if (!stage) return;

		panel.dataset.demoReady = "true";

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const cursorEl = panel.querySelector<HTMLElement>("[data-demo-cursor]");
		const ringEl = panel.querySelector<HTMLElement>("[data-demo-cursor-ring]");

		// Reduced motion leaves the settled markup alone — there is no demo to point
		// at, so the cursor is dropped here rather than in each beat.
		if (reducedMotion) {
			if (cursorEl) gsap.set(cursorEl, { autoAlpha: 0 });
			return;
		}

		const tl = build({
			panel,
			stage,
			pointer: cursorEl && ringEl ? createPointer(stage, cursorEl, ringEl) : null,
		});
		if (!tl) return;

		// Lets the tab controller pace its auto-advance off this beat's real length.
		// `pause(0)` below doesn't fire it, so it only ever marks a finished play.
		tl.eventCallback("onComplete", () => panel.dispatchEvent(new CustomEvent(PANEL_DONE)));

		// Render position 0 now so the panel starts in its "before" state rather
		// than flashing the settled markup until it is first played.
		tl.pause(0);

		// Re-measure the pointer's targets — the stage's scale changes by breakpoint.
		const play = () => tl.invalidate().restart(true);

		if (autoPlay) {
			ScrollTrigger.create({ trigger: stage, start: "top 75%", once: true, onEnter: play });
		}
		// Listener lives on the panel, so it is collected with it.
		panel.addEventListener(PANEL_ENTER, play);

		prune();
		registered.add({ panel, tl });
		bindResize();
	}

	init();
	// Re-init after Astro view transitions / client-side swaps.
	document.addEventListener("astro:page-load", init);
}
