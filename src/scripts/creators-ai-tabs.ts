import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Observer);

/**
 * Pinned scroll-hijacking is desktop + motion-safe only; touch keeps native scrolling.
 * 64rem is Tailwind's `lg` — stated in rem, not px, so the pin and the two-column
 * layout switch at the same point when the root font size isn't 16px.
 */
const PIN_QUERY = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";
/** Cross-fade duration (s) between two tabs. */
const TRANSITION = 0.8;
/**
 * How much of a cross-fade (0-1) must play before the next gesture is accepted.
 * Scrolling is prevented while pinned, so a gesture that gets dropped here reads
 * to the user as the page freezing — locking for the *whole* fade is too long.
 */
const GESTURE_LOCK = 0.45;
/** Fade duration (s) of a tab's active/inactive state. */
const TAB_FADE = 0.4;
/** How long (s) to ignore input after the section pins — see engage(). */
const ENGAGE_COOLDOWN = 0.5;
/** Page scroll (in viewport heights) consumed per tab while the section is pinned. */
const SCROLL_PER_TAB = 5;
/** Opacity of the tabs that aren't active. Mirrors the CSS fallback in CreatorsAI.astro. */
const INACTIVE_OPACITY = 0.5;
/** Distance (yPercent) panels travel while cross-fading. */


function initCreatorsAITabs() {
	const root = document.querySelector<HTMLElement>("[data-creators-tabs]");
	if (!root || root.dataset.tabsReady === "true") return;

	const section = root.closest("section");
	const tabs = gsap.utils.toArray<HTMLElement>("[data-creators-tab]", root);
	const panels = gsap.utils.toArray<HTMLElement>("[data-creators-panel]", root);
	if (!section || tabs.length < 2 || tabs.length !== panels.length) return;

	root.dataset.tabsReady = "true";

	const lastIndex = tabs.length - 1;
	let index = 0;
	/** The running cross-fade; its `isActive()` is the "a switch is in flight" flag. */
	let transition: gsap.core.Timeline | null = null;
	/** Set by the pinned setup so tab clicks keep the scroll position in sync. */
	let syncScroll: ((target: number) => void) | null = null;

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

	/** Applies a tab immediately, with no cross-fade. */
	function setActive(next: number) {
		index = next;
		syncAria();

		gsap.set(tabs, { opacity: INACTIVE_OPACITY });
		gsap.set(tabs[next], { opacity: 1 });
		gsap.set(panels, { autoAlpha: 0 });
		gsap.set(panels[next], { autoAlpha: 1 });
	}

	
	function goTo(next: number) {
		if (next === index || next < 0 || next > lastIndex) return;

		const previous = index;
		index = next;
		syncAria();

		const fading = [panels[previous], panels[next]];

		transition = gsap
			.timeline({
				defaults: { overwrite: true },
				onStart: () => gsap.set(fading, { willChange: "opacity" }),
				onComplete: () => gsap.set(fading, { willChange: "auto" }),
			})
			.to(tabs[previous], { opacity: INACTIVE_OPACITY, duration: TAB_FADE }, 0)
			.to(tabs[next], { opacity: 1, duration: TAB_FADE }, 0)
			.to(panels[previous], { autoAlpha: 0, duration: TRANSITION * 0.6, ease: "power2.in" }, 0)
			.to(panels[next], { autoAlpha: 1, duration: TRANSITION, ease: "power2.out" }, 0);

		syncScroll?.(next);
	}

	setActive(0);

	// Tabs stay clickable/keyboard-navigable at every breakpoint.
	tabs.forEach((tab, i) => {
		tab.addEventListener("click", () => goTo(i));
		tab.addEventListener("keydown", (event) => {
			const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1
				: event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1
					: 0;
			if (!step) return;

			event.preventDefault();
			const next = gsap.utils.clamp(0, lastIndex, i + step);
			goTo(next);
			tabs[next].focus();
		});
	});

	gsap.matchMedia().add(PIN_QUERY, () => {
		let cooldown: gsap.core.Tween | null = null;

		function scrollFor(target: number) {
			const range = pin.end - pin.start;
			return gsap.utils.clamp(pin.start + 1, pin.end - 1, pin.start + (range * target) / lastIndex);
		}

		function release() {
			cooldown?.kill();
			cooldown = null;
			observer.disable();
		}

		/**
		 * Shows the tab the section is entered on (first from the top, last from the
		 * bottom) and keeps the observer OFF for a beat. The gesture that just crossed
		 * the pin threshold is still delivering momentum (wheel inertia / touch fling);
		 * enabling immediately would read that residual motion as a fresh advance and
		 * switch a tab the instant the section pins. Waiting for the momentum to die
		 * down means the first switch happens on the user's next deliberate gesture.
		 */
		function engage(target: number) {
			setActive(target);
			release();
			cooldown = gsap.delayedCall(ENGAGE_COOLDOWN, () => observer.enable());
		}

		function advance(direction: 1 | -1) {
			if (transition?.isActive() && transition.progress() < GESTURE_LOCK) return;

			const next = index + direction;
			if (next < 0 || next > lastIndex) {
				release();
				return;
			}

			goTo(next);
		}

		const observer = Observer.create({
			type: "wheel,touch",
			// Matches touch semantics: dragging/scrolling up advances to the next tab.
			wheelSpeed: -1,
			tolerance: 40,
			preventDefault: true,
			onUp: () => advance(1),
			onDown: () => advance(-1),
		});

		const pin = ScrollTrigger.create({
			trigger: section,
			// A section taller than the viewport must scroll fully into view before it pins.
			start: () => (section.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
			end: () => `+=${lastIndex * window.innerHeight * SCROLL_PER_TAB}`,
			pin: true,
			anticipatePin: 1,
			onEnter: () => engage(0),
			onEnterBack: () => engage(lastIndex),
			onLeave: release,
			onLeaveBack: release,
			// Resize/layout changes: re-align the active tab with the rescaled scroll
			// position, without touching whether we're currently listening.
			onRefresh: (self) => {
				if (self.isActive) setActive(Math.round(self.progress * lastIndex));
			},
		});

		observer.disable();
		// Scrolling is locked while pinned, so a tab click has to move the page itself.
		syncScroll = (target) => {
			if (pin.isActive) pin.scroll(scrollFor(target));
		};

		return () => {
			cooldown?.kill();
			syncScroll = null;
			observer.kill();
			pin.kill(true);
		};
	});
}

initCreatorsAITabs();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initCreatorsAITabs);
