import gsap from "gsap";
import { horizontalLoop } from "./gsap/horizontalLoop";

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

// Lens follows the pointer inside the strip; scales away when the mouse leaves.
function initLensFollow() {
	const stage = document.querySelector<HTMLElement>(".creator-stage");
	const lens = stage?.querySelector<HTMLElement>(".lg-lens");
	if (!stage || !lens || stage.dataset.lensReady === "true") return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const canHover = window.matchMedia("(hover: hover)").matches;
	// No hover (touch) or reduced motion: leave the static centered CSS lens as-is.
	if (reduceMotion || !canHover) return;

	stage.dataset.lensReady = "true";

	// Switch the lens from CSS centering to pointer-driven positioning.
	// Starts hidden and scaled down; it scales up on enter.
	gsap.set(lens, { left: 0, top: 0, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });

	const xTo = gsap.quickTo(lens, "x", { duration: 0.5, ease: "power3" });
	const yTo = gsap.quickTo(lens, "y", { duration: 0.5, ease: "power3" });

	const moveTo = (e: PointerEvent) => {
		const rect = stage.getBoundingClientRect();
		xTo(e.clientX - rect.left);
		yTo(e.clientY - rect.top);
	};

	stage.addEventListener("pointerenter", (e) => {
		const rect = stage.getBoundingClientRect();
		// Jump to the pointer instantly so the lens scales up where the cursor is.
		gsap.set(lens, { x: e.clientX - rect.left, y: e.clientY - rect.top });
		gsap.to(lens, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(1.6)" });
	});
	stage.addEventListener("pointermove", moveTo);
	stage.addEventListener("pointerleave", () => {
		gsap.to(lens, { scale: 0, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
	});
}

function init() {
	initCreatorMarquee();
	initLensFollow();
}

init();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", init);
