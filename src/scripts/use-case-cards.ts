import gsap from "gsap";
import { horizontalLoop } from "./gsap/horizontalLoop";

// Right-to-left infinite marquee of the use-case cards; pauses on hover.
function initUseCaseMarquee() {
	const marquee = document.querySelector<HTMLElement>(".use-case-marquee");
	const track = marquee?.querySelector<HTMLElement>(".use-case-track");
	if (!marquee || !track || track.dataset.marqueeReady === "true") return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduceMotion) return;

	track.dataset.marqueeReady = "true";

	const items = gsap.utils.toArray<HTMLElement>(".use-case-track > *");
	// gap-5 === 20px; keep the wrap spacing consistent with the flex gap.
	const loop = horizontalLoop(items, { repeat: -1, speed: 1, paddingRight: 20 });

	// Pause the loop while the pointer is over the strip, resume on leave.
	marquee.addEventListener("mouseenter", () => loop.pause());
	marquee.addEventListener("mouseleave", () => loop.play());
}

initUseCaseMarquee();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initUseCaseMarquee);
