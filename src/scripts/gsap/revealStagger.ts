import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface RevealStaggerOptions {
	/** Distance (px) the items travel up from. */
	y?: number;
	/** Tween duration (s) per item. */
	duration?: number;
	/** Delay (s) between items. */
	stagger?: number;
	/** GSAP ease. */
	ease?: string;
	/** ScrollTrigger start position. */
	start?: string;
	/** Play once, or replay every time it re-enters. */
	once?: boolean;
	/** Element that triggers the reveal (defaults to the items' parent). */
	trigger?: gsap.DOMTarget;
}

/**
 * Slide-up + fade-in reveal with stagger, triggered on scroll into view.
 * Reusable across sections — pass the elements (or a selector) to animate.
 */
export function revealStagger(targets: gsap.DOMTarget, options: RevealStaggerOptions = {}) {
	const els = gsap.utils.toArray<HTMLElement>(targets);
	if (!els.length) return;

	const {
		y = 40,
		duration = 0.8,
		stagger = 0.2,
		ease = "power1.out",
		start = "top 70%",
		once = true,
		trigger,
	} = options;

	// Reduced motion: show everything immediately, no animation.
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		gsap.set(els, { opacity: 1, y: 0 });
		return;
	}

	return gsap.from(els, {
		y,
		opacity: 0,
		duration,
		stagger,
		ease,
		scrollTrigger: {
			trigger: trigger ?? els[0].parentElement ?? els[0],
			start,
			once,
		},
	});
}
