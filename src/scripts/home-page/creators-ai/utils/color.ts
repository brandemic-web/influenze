/**
 * Colour helper shared by the CreatorsAI beats.
 *
 * A beat animates *to* values the UI element components already own, so none of
 * them restates a hex — the settled colour is read off the markup with
 * `getComputedStyle` before the timeline rewinds it. What that cannot give is the
 * *absent* end of a fill: a row that lights up has to start from its own colour
 * at zero alpha rather than from `transparent`, which GSAP resolves to
 * transparent black and would fade the row through a dark flash on the way in.
 */

/**
 * The same colour at a different alpha.
 *
 * Only ever fed computed values, which the CSS Object Model normalises to
 * `rgb(r g b)` / `rgba(r, g, b, a)` in some spelling — so the three channel
 * numbers are all this has to find. Anything it cannot parse is handed back
 * untouched, which degrades to GSAP's own handling rather than throwing mid-beat.
 */
export function fade(color: string, alpha: number) {
	const [r, g, b] = color.match(/[\d.]+/g)?.map(Number) ?? [];
	if (r === undefined || g === undefined || b === undefined) return color;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
