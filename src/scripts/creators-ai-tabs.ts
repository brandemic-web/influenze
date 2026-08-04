import gsap from "gsap";
import { PANEL_DONE, PANEL_ENTER } from "./creators-ai";

/**
 * Click-driven tabs for the "world's creators" section: clicking a feature
 * cross-fades its panel in. No scroll pinning — the section scrolls normally.
 *
 * The tabs also advance on their own. Rather than a fixed interval, each slide
 * is held until its demo timeline reports back (`PANEL_DONE`) plus a short beat,
 * so a long demo is never cut off and a short one doesn't linger. Clicking a tab
 * holds the rotation off long enough to read the slide you asked for, and the
 * rotation stops entirely while the visitor's cursor or focus is on the visuals —
 * the panels are real UI, so a slide that swapped out from under someone reading
 * a card would take the thing they were looking at with it.
 */

/** Cross-fade duration (s) between two panels. */
const TRANSITION = 0.8;
/** Fade duration (s) of a tab's active/inactive state. */
const TAB_FADE = 0.4;
/** Opacity of the tabs that aren't active. Mirrors the CSS fallback in CreatorsAI.astro. */
const INACTIVE_OPACITY = 0.5;
/** Quiet beat (s) between a panel's demo finishing and the auto-advance. */
const AUTO_DELAY = 2;
/** How long (s) a manual tab selection holds the auto-advance off. */
const MANUAL_HOLD = 6;
/** Fraction of the visuals that has to be on screen for the rotation to run. */
const IN_VIEW_RATIO = 0.3;

function initCreatorsAITabs() {
	const root = document.querySelector<HTMLElement>("[data-creators-tabs]");
	if (!root || root.dataset.tabsReady === "true") return;

	const tabs = gsap.utils.toArray<HTMLElement>("[data-creators-tab]", root);
	const panels = gsap.utils.toArray<HTMLElement>("[data-creators-panel]", root);
	// A mismatch means the markup and CREATORS_AI_FEATURES have drifted apart.
	// Bailing silently leaves the whole section dead on the page, so say why.
	if (tabs.length < 2 || tabs.length !== panels.length) {
		console.warn(
			`[creators-ai] disabled: found ${tabs.length} tab(s) and ${panels.length} panel(s) — expected an equal count of at least 2.`,
		);
		return;
	}

	root.dataset.tabsReady = "true";

	const lastIndex = tabs.length - 1;
	let index = 0;

	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	/** The queued advance, if one is armed. */
	let pending: gsap.core.Tween | null = null;
	/** `performance.now()` before which a manual selection blocks the advance. */
	let holdUntil = 0;
	/** True once the current panel's demo has finished, i.e. it may be left. */
	let settled = false;
	let inView = false;
	/**
	 * Whether the visitor is currently on the visuals, by cursor or by focus.
	 *
	 * Two flags rather than one because the two overlap: a keyboard user's focus
	 * ring stays inside a card while the mouse wanders off it, and collapsing them
	 * would let whichever ended last hand the rotation back early.
	 */
	let hovering = false;
	let focused = false;

	function cancelAuto() {
		pending?.kill();
		pending = null;
	}

	/**
	 * Arms the next advance. Fires once *both* the post-demo beat and any manual
	 * hold have elapsed, so a click never gets cut short by a demo that happens
	 * to finish right after it.
	 */
	function scheduleAuto() {
		cancelAuto();
		if (reducedMotion || !inView || !settled || hovering || focused) return;

		const hold = (holdUntil - performance.now()) / 1000;
		pending = gsap.delayedCall(Math.max(AUTO_DELAY, hold), () => {
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
			.to(tabs[previous], { opacity: INACTIVE_OPACITY, duration: TAB_FADE }, 0)
			.to(tabs[next], { opacity: 1, duration: TAB_FADE }, 0)
			.to(panels[previous], { autoAlpha: 0, duration: TRANSITION * 0.6, ease: "power2.in" }, 0)
			.to(panels[next], { autoAlpha: 1, duration: TRANSITION, ease: "power2.out" }, 0);

		return true;
	}

	/** A tab the visitor picked: hold the rotation, then carry on as normal. */
	function selectManually(next: number) {
		holdUntil = performance.now() + MANUAL_HOLD * 1000;
		// Re-clicking the active tab still earns the hold, but there is no new
		// demo to wait on — re-arm off the panel that is already settled.
		if (!goTo(next)) scheduleAuto();
	}

	// Initial state, with no cross-fade.
	syncAria();
	gsap.set(tabs, { opacity: INACTIVE_OPACITY });
	gsap.set(tabs[index], { opacity: 1 });
	gsap.set(panels, { autoAlpha: 0 });
	gsap.set(panels[index], { autoAlpha: 1 });

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

	// The collage the panels are laid out on — the visuals, not the feature list.
	const stage = panels[0].parentElement ?? root;

	// Hold the rotation while the visitor is on the visuals. The panels are real UI
	// markup, so someone reading a card or reaching for a control in it is mid-task,
	// and swapping the panel out from under them loses whatever they were looking at.
	//
	// Listening on the stage rather than each card is what makes moving between two
	// cards one continuous hover — per-card listeners would fire leave/enter across
	// the gap and restart the countdown from the top each time. `scheduleAuto`
	// cancels before it re-arms and bails on the flags above, so both directions can
	// call just it.
	stage.addEventListener("pointerenter", (event) => {
		// A tap fires enter with no matching leave until the next interaction, which
		// would hold the rotation off for good on a touch device.
		if (event.pointerType === "touch") return;
		hovering = true;
		scheduleAuto();
	});
	stage.addEventListener("pointerleave", () => {
		hovering = false;
		scheduleAuto();
	});

	// `focusin`/`focusout` rather than focus/blur: those don't bubble, and the focus
	// lands on a control inside a card, not on the stage itself.
	stage.addEventListener("focusin", () => {
		focused = true;
		scheduleAuto();
	});
	stage.addEventListener("focusout", () => {
		focused = false;
		scheduleAuto();
	});

	// Rotating while the visuals are off screen would strand the visitor on a
	// mid-sequence slide, so the timer only runs while they're actually visible.
	new IntersectionObserver((entries) => {
		inView = entries[0].isIntersecting;
		if (inView) scheduleAuto();
		else cancelAuto();
	}, { threshold: IN_VIEW_RATIO }).observe(stage);
}

initCreatorsAITabs();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initCreatorsAITabs);
