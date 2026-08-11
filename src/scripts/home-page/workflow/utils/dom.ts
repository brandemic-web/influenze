import gsap from "gsap";

/** Small helpers shared by the workflow beats. */

/** Read a `wf-` colour token from app-tokens.css, so no beat restates a hex. */
export function token(name: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(`--color-wf-${name}`).trim();
}

/**
 * Trade one inline hook for another. Sequential, not a crossfade: the pairs are
 * mutually exclusive, and holding both would briefly widen the row.
 */
export function swapInline(from: HTMLElement, to: HTMLElement) {
	return gsap
		.timeline()
		.to(from, { opacity: 0, duration: 0.14 })
		.set(from, { display: "none" })
		.set(to, { display: "inline", opacity: 0 })
		.to(to, { opacity: 1, duration: 0.2 });
}
