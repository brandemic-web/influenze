/**
 * Fits an app canvas to whatever width the page gives it, publishing the ratio as
 * `--wf-scale` on the container. See `.wf-stage` / `.wf-strip-canvas` in
 * styles/app-tokens.css — which stays the only place canvas geometry is written,
 * since both widths are measured rather than hardcoded here.
 *
 * Done in JS because CSS can't be trusted with it: `tan(atan2(100cqw, 90rem))` is
 * the only way CSS divides two lengths, and Safari 26 misreads atan2's degrees as
 * radians whenever a container-query or viewport unit is involved. Every CSS route
 * (registered custom properties, `round()`, `zoom`, `transform: scale()`) resolves
 * through the same broken path.
 */

/** `[data-canvas-fit]` measures itself; `[data-canvas]` inside it is the canvas. */
const CONTAINER = "[data-canvas-fit]";

function fit(container: HTMLElement) {
	const canvas = container.querySelector<HTMLElement>("[data-canvas]");
	if (!canvas) return;

	const canvasWidth = parseFloat(getComputedStyle(canvas).width);
	// `offsetWidth`, not the painted rect: the landscape viewer rotates an ancestor a
	// quarter turn, and a rect would report that box's height instead.
	const containerWidth = container.offsetWidth;
	if (!canvasWidth || !containerWidth) return;

	container.style.setProperty("--wf-scale", String(containerWidth / canvasWidth));
}

// Width is the only input that moves on its own: the root font-size is fluid above
// lg, but so is every container, so a font-size change arrives as a resize anyway.
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
