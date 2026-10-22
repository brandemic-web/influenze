// Scrolls to a section without writing "#id" into the address bar, so the shared URL stays the bare page.
const init = () => {
	document.querySelectorAll<HTMLAnchorElement>("a[data-scroll-link]").forEach((link) => {
		if (link.dataset.scrollBound) return;
		link.dataset.scrollBound = "true";
		link.addEventListener("click", (e) => {
			const target = document.querySelector(link.getAttribute("href") ?? "");
			if (!target) return;
			e.preventDefault();
			const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
		});
	});
};

init();
document.addEventListener("astro:page-load", init);
