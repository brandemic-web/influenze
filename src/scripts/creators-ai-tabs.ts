import gsap from "gsap";
import { PANEL_DONE, PANEL_ENTER } from "./creators-ai";
import { DESKTOP_MIN } from "./breakpoints";

/**
 * Tabs for the "world's creators" section: clicking a feature cross-fades its panel
 * in. They also advance on their own, but paced off each demo's own `PANEL_DONE`
 * rather than a fixed interval, so no demo is cut off or left lingering.
 */

/** Cross-fade duration (s) between two panels. */
const TRANSITION = 0.8;
/** Fade duration (s) of a tab's active/inactive state. */
const TAB_FADE = 0.4;
/** Opacity of the tabs that aren't active, once there is room to list them all. */
const INACTIVE_OPACITY = 0.5;
/** Quiet beat (s) between a panel's demo finishing and the auto-advance. */
const AUTO_DELAY = 2;
/**
 * How long (s) a stacked slide waits on a demo that never fires PANEL_DONE. While
 * stacked, waiting forever would leave the other three features unreachable.
 */
const STALL_FALLBACK = 12;
/** How long (s) a manual tab selection holds the auto-advance off. */
const MANUAL_HOLD = 6;
/** Fraction of the visuals that has to be on screen for the rotation to run. */
const IN_VIEW_RATIO = 0.3;

function initCreatorsAITabs() {
	const root = document.querySelector<HTMLElement>("[data-creators-tabs]");
	if (!root || root.dataset.tabsReady === "true") return;

	const tabs = gsap.utils.toArray<HTMLElement>("[data-creators-tab]", root);
	const panels = gsap.utils.toArray<HTMLElement>("[data-creators-panel]", root);
	// A mismatch means the markup and CREATORS_AI_FEATURES have drifted apart, which
	// leaves the whole section dead — so say why rather than bailing silently.
	if (tabs.length < 2 || tabs.length !== panels.length) {
		console.warn(
			`[creators-ai] disabled: found ${tabs.length} tab(s) and ${panels.length} panel(s) — expected an equal count of at least 2.`,
		);
		return;
	}

	root.dataset.tabsReady = "true";

	const lastIndex = tabs.length - 1;
	let index = 0;

	/**
	 * Below lg the features stack into one grid cell, so an inactive tab must fade out
	 * entirely rather than dim to 0.5. `autoAlpha` also flips `visibility`, taking the
	 * hidden ones out of the tab order.
	 *
	 * Keep this query identical to CreatorsAI.astro's, `no-preference` included — the
	 * rotation is what reveals the other features and does not run under reduced
	 * motion, so those readers keep the full list. Read per tween, not captured once.
	 */
	const stacked = window.matchMedia(
		`(max-width: ${DESKTOP_MIN - 1}px) and (prefers-reduced-motion: no-preference)`,
	);
	const inactiveAlpha = () => (stacked.matches ? 0 : INACTIVE_OPACITY);

	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	/** The queued advance, if one is armed. */
	let pending: gsap.core.Tween | null = null;
	/** `performance.now()` before which a manual selection blocks the advance. */
	let holdUntil = 0;
	/** True once the current panel's demo has finished, i.e. it may be left. */
	let settled = false;
	let inView = false;

	function cancelAuto() {
		pending?.kill();
		pending = null;
	}

	/**
	 * Arm the next advance. Fires once *both* the post-demo beat and any manual hold
	 * have elapsed, so a click is never cut short by a demo finishing right after it.
	 */
	function scheduleAuto() {
		cancelAuto();
		if (reducedMotion || !inView) return;
		// An unsettled slide waits — unless stacked, where it can't. See STALL_FALLBACK.
		if (!settled && !stacked.matches) return;

		const hold = (holdUntil - performance.now()) / 1000;
		pending = gsap.delayedCall(Math.max(settled ? AUTO_DELAY : STALL_FALLBACK, hold), () => {
			goTo(index === lastIndex ? 0 : index + 1);
		});
	}

	function syncAria() {
		tabs.forEach((tab, i) => {
			tab.setAttribute("aria-selected", String(i === index));
			tab.tabIndex = i === index ? 0 : -1;
		});
		panels.forEach((panel, i) => {
			if (i === index) panel.removeAttribute("aria-hidden");
			else panel.setAttribute("aria-hidden", "true");
		});
	}

	/** Returns false when the request was a no-op. */
	function goTo(next: number) {
		if (next === index || next < 0 || next > lastIndex) return false;

		const previous = index;
		index = next;
		settled = false;
		cancelAuto();
		syncAria();

		// Lets a panel replay its own demo timeline whenever it becomes active.
		panels[next].dispatchEvent(new CustomEvent(PANEL_ENTER));

		const fading = [panels[previous], panels[next]];

		gsap
			.timeline({
				defaults: { overwrite: true },
				onStart: () => gsap.set(fading, { willChange: "opacity" }),
				onComplete: () => gsap.set(fading, { willChange: "auto" }),
			})
			.to(tabs[previous], { autoAlpha: inactiveAlpha(), duration: TAB_FADE }, 0)
			.to(tabs[next], { autoAlpha: 1, duration: TAB_FADE }, 0)
			.to(panels[previous], { autoAlpha: 0, duration: TRANSITION * 0.6, ease: "power2.in" }, 0)
			.to(panels[next], { autoAlpha: 1, duration: TRANSITION, ease: "power2.out" }, 0);

		// Arms the stall fallback. A no-op unless stacked.
		scheduleAuto();

		return true;
	}

	/** A tab the visitor picked: hold the rotation, then carry on as normal. */
	function selectManually(next: number) {
		holdUntil = performance.now() + MANUAL_HOLD * 1000;
		// Re-clicking the active tab earns the hold but starts no new demo, so re-arm.
		if (!goTo(next)) scheduleAuto();
	}

	/** Repaints the tabs' resting state with no cross-fade. */
	function paintTabs() {
		gsap.set(tabs, { autoAlpha: inactiveAlpha() });
		gsap.set(tabs[index], { autoAlpha: 1 });
	}

	// Initial state, with no cross-fade.
	syncAria();
	paintTabs();
	gsap.set(panels, { autoAlpha: 0 });
	gsap.set(panels[index], { autoAlpha: 1 });

	// Crossing the breakpoint changes what "inactive" looks like — without this a
	// reader who rotates to landscape keeps three invisible features.
	stacked.addEventListener("change", paintTabs);

	panels.forEach((panel, i) => {
		panel.addEventListener(PANEL_DONE, () => {
			if (i !== index) return;
			settled = true;
			scheduleAuto();
		});
	});

	tabs.forEach((tab, i) => {
		tab.addEventListener("click", () => selectManually(i));
		tab.addEventListener("keydown", (event) => {
			const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1
				: event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1
					: 0;
			if (!step) return;

			event.preventDefault();
			const next = gsap.utils.clamp(0, lastIndex, i + step);
			selectManually(next);
			tabs[next].focus();
		});
	});

	// Mobile arrows — the only manual control below lg, where the tabs are inert.
	// They wrap, and go through selectManually so a tap earns the same hold.
	root.querySelectorAll<HTMLElement>("[data-creators-prev],[data-creators-next]").forEach(
		(arrow) => {
			const step = arrow.hasAttribute("data-creators-next") ? 1 : -1;
			arrow.addEventListener("click", () => {
				selectManually((index + step + tabs.length) % tabs.length);
			});
		},
	);

	// Rotating off screen would strand the visitor mid-sequence, so the timer only
	// runs while the visuals are actually visible.
	const stage = panels[0].parentElement ?? root;
	/** Whether the first panel has been told to play. */
	let started = false;

	new IntersectionObserver((entries) => {
		inView = entries[0].isIntersecting;
		if (!inView) {
			cancelAuto();
			return;
		}

		// The first panel's demo starts on the same signal as the rotation, so the two
		// can't disagree about when the section is in view. Below lg the stage sits far
		// below the feature block, so a separate ScrollTrigger would let the rotation
		// advance past a demo that was never asked to play.
		if (!started) {
			started = true;
			panels[index].dispatchEvent(new CustomEvent(PANEL_ENTER));
		}

		scheduleAuto();
	}, { threshold: IN_VIEW_RATIO }).observe(stage);
}

initCreatorsAITabs();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initCreatorsAITabs);
