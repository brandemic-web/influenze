/**
 * Viewport breakpoints shared by the animation scripts, so desktop/mobile-only
 * behaviour agrees with the CSS it animates. These are Tailwind's defaults —
 * global.css overrides no breakpoints; if it ever does, change these to match.
 */

/** Width (px) at and above which `lg:` applies. Components switch layout here. */
export const DESKTOP_MIN = 1024;

/** Read when the behaviour runs, not at page load — the reader may have resized. */
export function isDesktop(): boolean {
	return window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`).matches;
}

/** Whether the reader has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
