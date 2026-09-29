import gsap from "gsap";

/**
 * Category filter for the blog listing. `hidden`, not opacity, removes filtered cards from the
 * grid's flow and tab order; the fade on the rest is skipped under reduced motion.
 */
const ALL = "all";
const DURATION = 0.28;

export function initBlogFilter() {
	const root = document.querySelector<HTMLElement>("[data-blog-listing]");
	if (!root || root.dataset.blogFilterReady === "true") return;
	root.dataset.blogFilterReady = "true";

	const chips = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-blog-filter]"));
	const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-blog-card]"));
	const grid = root.querySelector<HTMLElement>("[data-blog-grid]");
	const empty = root.querySelector<HTMLElement>("[data-blog-empty]");
	if (!chips.length || !cards.length || !grid) return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const select = (category: string) => {
		for (const chip of chips) {
			chip.setAttribute("aria-pressed", chip.dataset.category === category ? "true" : "false");
		}

		const shown: HTMLElement[] = [];
		for (const card of cards) {
			const match = category === ALL || card.dataset.category === category;
			card.hidden = !match;
			if (match) shown.push(card);
		}

		grid.hidden = shown.length === 0;
		if (empty) empty.hidden = shown.length > 0;

		if (reduceMotion || !shown.length) return;
		gsap.fromTo(
			shown,
			{ opacity: 0, y: 12 },
			{ opacity: 1, y: 0, duration: DURATION, stagger: 0.05, ease: "power2.out", overwrite: true },
		);
	};

	for (const chip of chips) {
		chip.addEventListener("click", () => select(chip.dataset.category ?? ALL));
	}
}

// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initBlogFilter);
