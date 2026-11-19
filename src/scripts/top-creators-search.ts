// Top creators hub: the search box filters the list cards by name as you type.
// The box ships hidden, so without JavaScript the page is just the full list.
function initListSearch() {
	document.querySelectorAll<HTMLElement>("[data-list-search]").forEach((root) => {
		const box = root.querySelector<HTMLElement>("[data-list-search-box]");
		const input = box?.querySelector<HTMLInputElement>("input");
		if (!box || !input || root.dataset.searchReady === "true") return;
		root.dataset.searchReady = "true";
		box.hidden = false;

		const items = Array.from(root.querySelectorAll<HTMLElement>("[data-list-search-item]"));
		const empty = root.querySelector<HTMLElement>("[data-list-search-empty]");
		input.addEventListener("input", () => {
			const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
			let shown = 0;
			for (const item of items) {
				const text = item.dataset.listSearchItem ?? "";
				const match = words.every((word) => text.includes(word));
				item.hidden = !match;
				if (match) shown += 1;
			}
			if (empty) empty.hidden = shown > 0;
		});
	});
}

initListSearch();
document.addEventListener("astro:page-load", initListSearch);
