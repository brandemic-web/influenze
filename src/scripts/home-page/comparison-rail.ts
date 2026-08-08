/**
 * Always-visible sideways-scroll rail.
 *
 * The native scrollbar cannot be made permanent in the contexts that matter
 * here: iOS Safari and Chrome's device emulation both force an overlay bar that
 * fades out after a drag and ignore `::-webkit-scrollbar` styling entirely. So
 * the bar is drawn as real DOM instead — always painted, and draggable.
 *
 * Markup: `data-rail-scroller="<id>"` on the overflow container, plus a
 * `data-rail="<id>"` element containing `data-rail-thumb`. The native bar should
 * be hidden in CSS so the two do not both show.
 *
 * The rail hides itself whenever there is nothing to scroll, which is also how
 * it stays out of the way of the desktop layout (where the container is
 * `overflow-visible`, so scrollWidth equals clientWidth).
 */

/** Keep the thumb grabbable however wide the content gets. */
const MIN_THUMB = 24;

function initRails() {
	document.querySelectorAll<HTMLElement>("[data-rail-scroller]").forEach((scroller) => {
		if (scroller.dataset.railReady === "true") return;

		const rail = document.querySelector<HTMLElement>(
			`[data-rail="${scroller.dataset.railScroller}"]`,
		);
		const thumb = rail?.querySelector<HTMLElement>("[data-rail-thumb]");
		if (!rail || !thumb) return;

		scroller.dataset.railReady = "true";

		const sync = () => {
			const overflow = scroller.scrollWidth - scroller.clientWidth;

			// Sub-pixel slack: layout rounding leaves a fraction of a pixel of
			// "overflow" on containers that do not actually scroll.
			rail.hidden = overflow <= 1;
			if (rail.hidden) return;

			const railWidth = rail.clientWidth;
			const width = Math.max(
				MIN_THUMB,
				(scroller.clientWidth / scroller.scrollWidth) * railWidth,
			);
			const travel = railWidth - width;

			thumb.style.width = `${width}px`;
			thumb.style.transform = `translateX(${(scroller.scrollLeft / overflow) * travel}px)`;
		};

		sync();
		scroller.addEventListener("scroll", sync, { passive: true });
		window.addEventListener("resize", sync);

		// Drag the thumb to scroll. Pointer capture keeps the gesture alive once the
		// pointer wanders off a thumb this short.
		let startX = 0;
		let startScroll = 0;

		thumb.addEventListener("pointerdown", (event) => {
			event.preventDefault();
			startX = event.clientX;
			startScroll = scroller.scrollLeft;
			thumb.setPointerCapture(event.pointerId);
			rail.dataset.railDragging = "";
		});

		thumb.addEventListener("pointermove", (event) => {
			if (!thumb.hasPointerCapture(event.pointerId)) return;

			const overflow = scroller.scrollWidth - scroller.clientWidth;
			const travel = rail.clientWidth - thumb.offsetWidth;
			if (travel <= 0) return;

			scroller.scrollLeft = startScroll + ((event.clientX - startX) / travel) * overflow;
		});

		const endDrag = (event: PointerEvent) => {
			if (thumb.hasPointerCapture(event.pointerId)) thumb.releasePointerCapture(event.pointerId);
			delete rail.dataset.railDragging;
		};

		thumb.addEventListener("pointerup", endDrag);
		thumb.addEventListener("pointercancel", endDrag);
	});
}

initRails();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initRails);
