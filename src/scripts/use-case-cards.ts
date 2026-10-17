import gsap from "gsap";
import { horizontalLoop } from "./gsap/horizontalLoop";

// Right-to-left infinite marquee of card strips (`.use-case-marquee` holding a
// `.use-case-track` with its cards rendered twice); pauses on hover. Used by the
// homepage's use cases and the landing pages' "who is it for".
function initUseCaseMarquees() {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduceMotion) return;

	document.querySelectorAll<HTMLElement>(".use-case-marquee").forEach((marquee) => {
		const track = marquee.querySelector<HTMLElement>(".use-case-track");
		if (!track || track.dataset.marqueeReady === "true") return;
		track.dataset.marqueeReady = "true";

		const items = gsap.utils.toArray<HTMLElement>(track.children);
		// Wrap spacing must match the flex gap, which is rem-based and varies with the fluid root font-size.
		const loop = horizontalLoop(items, {
			repeat: -1,
			speed: 1,
			paddingRight: parseFloat(getComputedStyle(track).columnGap) || 20,
		});

		// Pause the loop while the pointer is over the strip, resume on leave.
		marquee.addEventListener("mouseenter", () => loop.pause());
		marquee.addEventListener("mouseleave", () => loop.play());
	});
}

initUseCaseMarquees();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initUseCaseMarquees);
