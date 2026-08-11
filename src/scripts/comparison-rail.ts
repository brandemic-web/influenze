/**
 * Always-visible sideways-scroll rail, drawn as real DOM: iOS Safari and Chrome's
 * device emulation both force a fading overlay bar and ignore `::-webkit-scrollbar`.
 *
 * Markup: `data-rail-scroller="<id>"` on the overflow container, plus `data-rail="<id>"`
 * containing `data-rail-thumb`. Hide the native bar in CSS so both don't show. The rail
 * hides itself when there is nothing to scroll, which is also how it keeps out of the
 * desktop layout's way.
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
