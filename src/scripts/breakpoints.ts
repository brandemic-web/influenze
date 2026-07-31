/**
 * Viewport breakpoints shared by the animation scripts, so a behaviour that is
 * meant for desktop or mobile only agrees with the CSS it animates.
 *
 * These mirror Tailwind's own breakpoints. The project uses Tailwind v4 with no
 * breakpoint overrides in the `@theme` block of styles/global.css, so the values
 * are the framework defaults. If a breakpoint is ever customised there, change
 * it here to match.
 */

/**
 * Width (px) at and above which `lg:` classes apply — Tailwind's `lg` (64rem).
 *
 * This project's components switch layout at `lg:`, so scripts that run one
 * animation on desktop and another on mobile should split here rather than at a
 * breakpoint of their own.
 */
export const DESKTOP_MIN = 1024;

/**
 * Whether the viewport is currently desktop-width.
 *
 * Read this when the behaviour is about to run, not once at page load — the
 * reader may have rotated or resized in between.
 */
export function isDesktop(): boolean {
	return window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`).matches;
}

/** Whether the reader has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
