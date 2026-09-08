import { prefersReducedMotion } from "./breakpoints";

/**
 * Category filtering on the blog index. Pure show/hide over cards already
 * in the DOM. Cards carry categories as a "|"-joined `data-category`.
 */

// Kept in step with CategoryFilter.astro, which renders the initial state.
const ACTIVE_CLASSES = ["border-transparent", "bg-button-primary", "text-button-text"];
const INACTIVE_CLASSES = ["border-white/10", "bg-surface-card", "text-white/70", "hover:text-white"];

function setPressed(button: HTMLElement, pressed: boolean) {
	button.setAttribute("aria-pressed", String(pressed));
	button.classList.remove(...(pressed ? INACTIVE_CLASSES : ACTIVE_CLASSES));
	button.classList.add(...(pressed ? ACTIVE_CLASSES : INACTIVE_CLASSES));
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
			const matches = selected === "all" || categories.includes(selected);

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
