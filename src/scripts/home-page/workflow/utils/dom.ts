import gsap from "gsap";

/** Small helpers shared by the workflow beats. */

/** Read a `wf-` colour token from app-tokens.css, so no beat restates a hex. */
export function token(name: string) {
	return getComputedStyle(document.documentElement).getPropertyValue(`--color-wf-${name}`).trim();
}

/**
 * A colour at zero alpha, for the *start* of a fade-in.
 *
 * GSAP reads a plain `transparent` as `rgba(0, 0, 0, 0)`, so a box winding back to
 * it greys on the way to its real colour rather than simply fading in — visible
 * enough on a 12px checkbox to read as a first click that did something else.
 * Winding back to the target's own hue means the tween only ever moves alpha.
 */
export function clearFill(colour: string) {
	const hex = colour.trim();
	if (!hex.startsWith("#")) return hex;
	const n = Number.parseInt(hex.length === 4 ? hex.slice(1).replace(/./g, "$&$&") : hex.slice(1), 16);
	return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0)`;
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
