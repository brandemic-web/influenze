import gsap from "gsap";
import { horizontalLoop } from "./gsap/horizontalLoop";

/**
 * Declarative right-to-left marquee. Add `data-marquee` to a wrapper and
 * `data-marquee-track` to the flex row inside it; the track's direct children
 * scroll right-to-left.
 *
 * Scope the animation with the attribute value:
 *   data-marquee            below the `lg` breakpoint only (default)
 *   data-marquee="always"   at every width
 *
 * Duplicate the items in the markup so the loop has enough content to stay
 * gapless on wide viewports, and tag each copy with `data-marquee-clone`,
 * `class="hidden"` and `aria-hidden="true"`. Clones stay display:none until the
 * loop actually takes over, so the static fallback shows every item exactly once.
 *
 * The wrapper must be `overflow-x-auto` in the markup: when the loop does not
 * run — reduced-motion users, or if this script fails to load — the row stays
 * reachable by swipe/wheel instead of being clipped away. Once the loop is live
 * the wrapper is switched to `overflow-x: clip` (not `hidden`, which would
 * promote overflow-y to a nested scroll container).
 *
 * gsap.matchMedia reverts every tween/set it created once the query stops
 * matching, so clones re-hide and the row snaps back to its static layout on
 * resize.
 */
const SCOPES: Record<string, string> = {
	mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
	always: "(prefers-reduced-motion: no-preference)",
};

const mm = gsap.matchMedia();

function initMarquees() {
	document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((marquee) => {
		if (marquee.dataset.marqueeReady === "true") return;
		marquee.dataset.marqueeReady = "true";

		const scope = SCOPES[marquee.dataset.marquee || "mobile"] ?? SCOPES.mobile;

		mm.add(scope, () => {
			const track = marquee.querySelector<HTMLElement>("[data-marquee-track]");
			if (!track) return;

			// Reveal the clones before anything is measured — display:none elements
			// report a width of 0 and would collapse the loop.
			const clones = track.querySelectorAll<HTMLElement>("[data-marquee-clone]");
			if (clones.length) gsap.set(clones, { display: "block" });

			const items = gsap.utils.toArray<HTMLElement>(track.children);
			if (!items.length) return;

			// Transforms drive the row from here on, so drop the scroll affordance.
			// Any scroll offset the reader left behind would be unrecoverable once
			// clipped, so rewind it first.
			marquee.scrollLeft = 0;
			gsap.set(marquee, { overflowX: "clip" });

			// Wrap spacing must match the flex gap, which is rem-based and varies with the fluid root font-size.
			const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
			const loop = horizontalLoop(items, { repeat: -1, speed: 1, paddingRight: gap });

			// Pause the loop while the pointer is over the strip, resume on leave.
			const pause = () => loop.pause();
			const play = () => loop.play();
			marquee.addEventListener("mouseenter", pause);
			marquee.addEventListener("mouseleave", play);

			return () => {
				marquee.removeEventListener("mouseenter", pause);
				marquee.removeEventListener("mouseleave", play);
				loop.kill();
			};
		});
	});
}

initMarquees();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initMarquees);
