import gsap from "gsap";
import { horizontalLoop } from "./gsap/horizontalLoop";
import { DESKTOP_MIN } from "./breakpoints";

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

// One set of real links keeps the reading order stable and avoids duplicate tab stops.
function initLinkedUseCaseMarquees() {
	document.querySelectorAll<HTMLElement>(".linked-use-cases-rail").forEach((rail) => {
		const track = rail.querySelector<HTMLElement>(".use-case-track");
		if (!track || rail.dataset.marqueeReady === "true") return;
		rail.dataset.marqueeReady = "true";

		const items = gsap.utils.toArray<HTMLElement>(track.children);
		const media = gsap.matchMedia();
		media.add(`(min-width: ${DESKTOP_MIN}px) and (hover: hover) and (prefers-reduced-motion: no-preference)`, () => {
			let motion: gsap.Context | undefined;
			let loop: gsap.core.Timeline | undefined;
			let focusFrame = 0;

			const pause = () => loop?.pause();
			const resume = () => {
				if (rail.matches(":hover, :focus-within")) return;
				const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
				// A wrapped card must re-enter outside the viewport.
				if (!items.length || track.offsetWidth < rail.clientWidth + items[0].offsetWidth) return;
				if (!motion) {
					rail.scrollLeft = 0;
					rail.dataset.looping = "";
					motion = gsap.context(() => {
						loop = horizontalLoop(items, { repeat: -1, speed: 1, paddingRight: gap });
					});
				}
				loop?.play();
			};
			const reset = () => {
				motion?.revert();
				motion = undefined;
				loop = undefined;
				delete rail.dataset.looping;
			};
			const focus = ({ target }: FocusEvent) => {
				pause();
				if (target instanceof HTMLElement && target.matches(":focus-visible")) {
					reset();
					target.scrollIntoView({ block: "nearest", inline: "nearest" });
				}
			};
			const blur = () => {
				cancelAnimationFrame(focusFrame);
				focusFrame = requestAnimationFrame(resume);
			};
			const resize = () => {
				reset();
				resume();
			};

			resume();
			rail.addEventListener("mouseenter", pause);
			rail.addEventListener("mouseleave", resume);
			rail.addEventListener("focusin", focus);
			rail.addEventListener("focusout", blur);
			window.addEventListener("resize", resize);
			return () => {
				cancelAnimationFrame(focusFrame);
				rail.removeEventListener("mouseenter", pause);
				rail.removeEventListener("mouseleave", resume);
				rail.removeEventListener("focusin", focus);
				rail.removeEventListener("focusout", blur);
				window.removeEventListener("resize", resize);
				reset();
			};
		});
		document.addEventListener("astro:before-swap", () => media.revert(), { once: true });
	});
}

function init() {
	initUseCaseMarquees();
	initLinkedUseCaseMarquees();
}

init();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", init);
