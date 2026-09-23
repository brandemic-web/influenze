import gsap from "gsap";

/**
 * Category filter for the blog listing. Selecting a chip hides every card whose
 * `data-category` doesn't match, and swaps the grid for the empty state when
 * nothing does.
 *
 * `hidden` does the hiding, not opacity — a filtered-out card must leave the
 * grid's flow and the tab order, not just fade. The fade is applied to the cards
 * that stay, and is skipped entirely under `prefers-reduced-motion`.
 *
 * Progressive enhancement: without this script every card is rendered and "All"
 * is already the selected chip, so the page reads as the unfiltered list.
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
