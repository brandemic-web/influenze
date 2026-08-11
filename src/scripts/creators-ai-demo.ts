import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PANEL_DONE, PANEL_ENTER } from "./creators-ai";

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared harness for the scripted demos that play inside the CreatorsAI tab
 * panels. Each panel owns a paused timeline; the harness handles measurement,
 * reduced motion, and replaying the timeline whenever its tab is selected.
 *
 * Every panel's markup renders in its *settled* state so the section still
 * looks right without JS. A timeline rewinds its pieces to the "before" state
 * in a block of sets at position 0 and plays forward from there, which is also
 * what makes the demos replayable.
 */

/**
 * Offset (px) from the cursor element's origin to the arrow's visual tip, so
 * targets line up under the point rather than the icon's bounding box.
 */
const TIP = { x: -5, y: -3 };

/** Seconds a pointer hop between two targets takes. */
export const HOP = 0.85;

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
	/** True when the visitor asked for reduced motion. */
	reducedMotion: boolean;
	/**
	 * Point on `el` in the stage's *unscaled* coordinate space — the space the
	 * cursor lives in. Dividing by the stage's rendered scale keeps the same
	 * numbers working at every breakpoint.
	 */
	point(el: Element, rx?: number, ry?: number): { x: number; y: number };
}

export interface PanelDemoOptions {
	/** Play as soon as the section scrolls into view (only the default tab). */
	autoPlay?: boolean;
}

/**
 * Wires a panel's demo timeline up to the tab that controls it. `build` returns
 * the timeline, or nothing to opt out (e.g. under reduced motion).
 */
export function registerPanelDemo(
	panelId: string,
	build: (ctx: DemoContext) => gsap.core.Timeline | undefined,
	{ autoPlay = false }: PanelDemoOptions = {},
) {
	function init() {
		const panel = document.getElementById(panelId);
		if (!panel || panel.dataset.demoReady === "true") return;

		const stage = panel.parentElement;
		if (!stage) return;

		panel.dataset.demoReady = "true";

		const point = (el: Element, rx = 0.5, ry = 0.5) => {
			const stageRect = stage.getBoundingClientRect();
			const scale = stageRect.width / stage.offsetWidth || 1;
			const rect = el.getBoundingClientRect();
			return {
				x: (rect.left - stageRect.left + rect.width * rx) / scale + TIP.x,
				y: (rect.top - stageRect.top + rect.height * ry) / scale + TIP.y,
			};
		};

		const tl = build({
			panel,
			stage,
			point,
			reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		});
		if (!tl) return;

		// Lets the tab controller pace its auto-advance off this demo's real length.
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

/**
 * Appends a pointer hop onto `target` followed by a click: the arrow dips and
 * a ring pulses out from the contact point.
 */
export function hopAndClick(
	tl: gsap.core.Timeline,
	ctx: DemoContext,
	cursor: HTMLElement,
	ring: HTMLElement,
	target: HTMLElement,
	position: gsap.Position = ">",
	rx = 0.5,
	ry = 0.5,
) {
	return tl
		.to(cursor, {
			x: () => ctx.point(target, rx, ry).x,
			y: () => ctx.point(target, rx, ry).y,
			duration: HOP,
			ease: "power3.inOut",
		}, position)
		.to(cursor, { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1 }, ">-0.05")
		.fromTo(ring,
			{ scale: 0.3, autoAlpha: 0.9 },
			{ scale: 1.7, autoAlpha: 0, duration: 0.55, ease: "power2.out" }, "<");
}
