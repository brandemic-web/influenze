import gsap from "gsap";
import { horizontalLoop } from "./gsap/horizontalLoop";

// Right-to-left infinite marquee of the "why choose us" feature cards; pauses on hover.
function initWhyChooseMarquee() {
	const marquee = document.querySelector<HTMLElement>(".why-choose-marquee");
	const track = marquee?.querySelector<HTMLElement>(".why-choose-track");
	if (!marquee || !track || track.dataset.marqueeReady === "true") return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduceMotion) return;

	track.dataset.marqueeReady = "true";

	const items = gsap.utils.toArray<HTMLElement>(".why-choose-track > *");
	// Wrap spacing must match the flex gap, which is rem-based and varies with the fluid root font-size.
	const loop = horizontalLoop(items, { repeat: -1, speed: 1, paddingRight: parseFloat(getComputedStyle(track).columnGap) || 20 });

	// Pause the loop while the pointer is over the strip, resume on leave.
	marquee.addEventListener("mouseenter", () => loop.pause());
	marquee.addEventListener("mouseleave", () => loop.play());
}

initWhyChooseMarquee();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initWhyChooseMarquee);
