import { prefersReducedMotion } from "./breakpoints";

/**
 * Category filtering on the blog index. Pure show/hide over cards already
 * in the DOM. Cards carry categories as a "|"-joined `data-category`.
 */

// The border-vs-fill look is pure CSS off this attribute (see CategoryFilter.astro's
// aria-pressed: variants) — no classes to keep in step here.
function setPressed(button: HTMLElement, pressed: boolean) {
	button.setAttribute("aria-pressed", String(pressed));
}

function initBlogFilter() {
	const filter = document.querySelector<HTMLElement>("[data-blog-filter]");
	if (!filter || filter.dataset.filterReady === "true") return;
	filter.dataset.filterReady = "true";

	const buttons = Array.from(filter.querySelectorAll<HTMLButtonElement>("[data-filter]"));
	const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-blog-card]"));
	const empty = document.querySelector<HTMLElement>("[data-blog-empty]");
	if (!buttons.length || !cards.length) return;

	const reduceMotion = prefersReducedMotion();

	const apply = (selected: string) => {
		let shown = 0;

		cards.forEach((card) => {
			const categories = (card.dataset.category ?? "").split("|");
			// hideOnAll cards (the featured post's grid twin) never show under "All" — the banner already covers it.
			const matches =
				card.dataset.hideOnAll === "true"
					? selected !== "all" && categories.includes(selected)
					: selected === "all" || categories.includes(selected);

			card.hidden = !matches;
			if (matches) {
				shown += 1;
				// Re-trigger the fade only when motion is welcome.
				if (!reduceMotion) {
					card.animate(
						[
							{ opacity: 0, transform: "translateY(0.5rem)" },
							{ opacity: 1, transform: "none" },
						],
						{ duration: 220, easing: "ease-out" },
					);
				}
			}
		});

		if (empty) empty.hidden = shown > 0;
	};

	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			buttons.forEach((other) => setPressed(other, other === button));
			apply(button.dataset.filter ?? "all");
		});
	});
}

initBlogFilter();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initBlogFilter);
