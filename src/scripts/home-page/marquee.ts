import gsap from "gsap";
import { horizontalLoop } from "../gsap/horizontalLoop";

/**
 * Declarative right-to-left marquee. `data-marquee` on a wrapper, `data-marquee-track`
 * on the flex row inside it; `data-marquee="always"` runs at every width, the default
 * only below `lg`.
 *
 * Duplicate the items in the markup for gapless looping on wide viewports, tagging each
 * copy `data-marquee-clone class="hidden" aria-hidden="true"` — clones stay hidden until
 * the loop takes over, so the static fallback shows each item once.
 *
 * The wrapper must be `overflow-x-auto` in the markup, so the row stays swipeable when
 * the loop doesn't run; it switches to `overflow-x: clip` once live (`hidden` would
 * promote overflow-y to a nested scroll container). gsap.matchMedia reverts everything
 * when the query stops matching, so resize snaps back cleanly.
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
