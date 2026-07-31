import gsap from "gsap";
import { horizontalLoop } from "../gsap/horizontalLoop";

// Right-to-left infinite marquee of the creator strip.
function initCreatorMarquee() {
	const track = document.querySelector<HTMLElement>(".creator-track");
	if (!track || track.dataset.marqueeReady === "true") return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduceMotion) return;

	track.dataset.marqueeReady = "true";

	const items = gsap.utils.toArray<HTMLElement>(".creator-track > *");
	// Wrap spacing must match the flex gap, which is rem-based and varies with the fluid root font-size.
	horizontalLoop(items, { repeat: -1, speed: 1, paddingRight: parseFloat(getComputedStyle(track).columnGap) || 20 });
}

// The lens stays where its CSS puts it — centred in the strip, always visible.
// It used to be pointer-driven (scaled up on enter, followed the cursor, scaled
// away on leave); that behaviour is gone, so nothing here touches it.

function init() {
	initCreatorMarquee();
}

init();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", init);
