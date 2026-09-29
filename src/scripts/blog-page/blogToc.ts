/**
 * Open/close for the fixed mobile contents bar; a link click, Escape or outside tap closes it.
 * Height animates in CSS (grid-rows, reduced-motion aware); `inert` keeps collapsed links untabbable.
 */
export function initBlogToc() {
	const root = document.querySelector<HTMLElement>("[data-blog-toc]");
	if (!root || root.dataset.blogTocReady === "true") return;

	const button = root.querySelector<HTMLButtonElement>("[data-blog-toc-toggle]");
	const panel = root.querySelector<HTMLElement>("[data-blog-toc-panel]");
	if (!button || !panel) return;
	root.dataset.blogTocReady = "true";

	const setOpen = (open: boolean) => {
		root.toggleAttribute("data-open", open);
		button.setAttribute("aria-expanded", String(open));
		panel.inert = !open;
	};

	setOpen(false);

	button.addEventListener("click", () => setOpen(!root.hasAttribute("data-open")));
	panel.addEventListener("click", (event) => {
		if ((event.target as Element).closest("a")) setOpen(false);
	});
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") setOpen(false);
	});
	document.addEventListener("pointerdown", (event) => {
		if (!root.contains(event.target as Node)) setOpen(false);
	});
}

initBlogToc();
document.addEventListener("astro:page-load", initBlogToc);
