/**
 * Fits an app canvas to whatever width the page gives it.
 *
 * The canvases are authored at the app's own geometry — 90rem for the hero's
 * 1440px frame, 55.25rem for the features strip's row width — and drawn at a
 * `scale` that divides their container's width by that authored width. This
 * publishes the ratio as `--wf-scale` on the container, which the canvas layers
 * inherit. See `.wf-stage` / `.wf-strip-canvas` in styles/app-tokens.css.
 *
 * The division used to be `scale: tan(atan2(100cqw, 90rem))` — the one way CSS
 * can divide two lengths into a unitless number. Safari 26 gets it wrong: with a
 * container-query or viewport unit in either argument it drops the degree unit
 * off atan2's angle and reads the number as radians, so the ratio comes back as
 * the tangent of an unrelated angle. The hero scaled to 0.73 instead of 0.42 and
 * overflowed its container; at some widths the tangent lands negative, which is
 * a 180-degree rotation and drew the strip upside down. Nothing addressable in
 * CSS survives it — a registered `<length>` custom property, `round()`, `calc()`,
 * `zoom` and `transform: scale()` all resolve through the same broken path — so
 * the division happens here.
 *
 * Neither element's width is read off a constant: the container is measured, and
 * the canvas reports the used value of its own CSS width. `scale` is a transform,
 * so that width stays the authored one however far down the canvas is drawn —
 * which keeps app-tokens.css the only place the canvas geometry is written.
 */

/** `[data-canvas-fit]` measures itself; `[data-canvas]` inside it is the canvas. */
const CONTAINER = "[data-canvas-fit]";

function fit(container: HTMLElement) {
	const canvas = container.querySelector<HTMLElement>("[data-canvas]");
	if (!canvas) return;

	const canvasWidth = parseFloat(getComputedStyle(canvas).width);
	// `offsetWidth`, not the painted rect: the landscape viewer turns an ancestor a
	// quarter turn, and a rect reports the axis-aligned box of the rotated result —
	// which is the container's height, so the canvas came out scaled to the wrong
	// axis. The layout width is what the canvas is being fitted to either way.
	const containerWidth = container.offsetWidth;
	if (!canvasWidth || !containerWidth) return;

	container.style.setProperty("--wf-scale", String(containerWidth / canvasWidth));
}

/*
 * Width is the only input that moves on its own. The canvas is sized in rem and
 * the root font-size is fluid above lg, but so is every container it sits in, so
 * a root font-size change always arrives as a container resize too.
 */
const observer = new ResizeObserver((entries) => {
	for (const entry of entries) fit(entry.target as HTMLElement);
});

function initCanvasScale() {
	document.querySelectorAll<HTMLElement>(CONTAINER).forEach((container) => {
		fit(container);
		observer.observe(container);
	});
}

initCanvasScale();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initCanvasScale);
