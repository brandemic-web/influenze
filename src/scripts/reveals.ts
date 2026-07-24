import { revealStagger } from "./gsap/revealStagger";

/**
 * Declarative reveal wiring. Add `data-reveal` to a container and
 * `data-reveal-item` to each element that should slide up + fade in.
 *
 * Optional tuning via data attributes on the container:
 *   data-reveal-y, data-reveal-stagger, data-reveal-duration, data-reveal-start
 */
const num = (v?: string) => (v == null || v === "" ? undefined : parseFloat(v));

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

		revealStagger(items, {
			trigger: container,
			y: num(container.dataset.revealY),
			stagger: num(container.dataset.revealStagger),
			duration: num(container.dataset.revealDuration),
			start: container.dataset.revealStart,
		});
	});
}

initReveals();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initReveals);
