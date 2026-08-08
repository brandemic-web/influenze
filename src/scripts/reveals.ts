import gsap from "gsap";
import { revealStagger } from "./gsap/revealStagger";
import { DESKTOP_MIN } from "./breakpoints";

/**
 * Declarative reveal wiring. Add `data-reveal` to a container and
 * `data-reveal-item` to each element that should slide up + fade in.
 *
 * Optional tuning via data attributes on the container:
 *   data-reveal-y, data-reveal-stagger, data-reveal-duration, data-reveal-start
 *
 * Add `data-reveal-desktop-only` to skip the reveal below `lg` — the items just
 * sit in place. Registered through gsap.matchMedia (as marquee.ts does) so
 * crossing the breakpoint on resize adds or reverts the reveal rather than
 * leaving items stuck at whatever the other viewport left behind.
 */
const num = (v?: string) => (v == null || v === "" ? undefined : parseFloat(v));

const mm = gsap.matchMedia();

function initReveals() {
	const containers = document.querySelectorAll<HTMLElement>("[data-reveal]");
	containers.forEach((container) => {
		if (container.dataset.revealReady === "true") return;
		container.dataset.revealReady = "true";

		// Prefer explicitly tagged items; fall back to direct children.
		const tagged = container.querySelectorAll<HTMLElement>("[data-reveal-item]");
		const items = tagged.length
			? Array.from(tagged)
			: (Array.from(container.children) as HTMLElement[]);

		const run = () => {
			revealStagger(items, {
				trigger: container,
				y: num(container.dataset.revealY),
				stagger: num(container.dataset.revealStagger),
				duration: num(container.dataset.revealDuration),
				start: container.dataset.revealStart,
			});
		};

		if (container.hasAttribute("data-reveal-desktop-only")) {
			mm.add(`(min-width: ${DESKTOP_MIN}px)`, run);
		} else {
			run();
		}
	});
}

initReveals();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initReveals);
