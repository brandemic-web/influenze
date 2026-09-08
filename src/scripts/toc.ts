/**
 * Marks the on-screen section in a sticky contents rail. Shared by the legal
 * routes and the blog article page, both building a `[data-toc]` nav with
 * `data-toc-link="<heading id>"` links. Whichever heading sits in a thin
 * band under the header is the one marked active.
 */
const HEADER_OFFSET = 128; // px — clears the fixed header, matches `scroll-mt-32`

function initToc(root: HTMLElement) {
	if (root.dataset.tocReady === "true") return;
	root.dataset.tocReady = "true";

	const links = new Map<string, HTMLAnchorElement>();
	root.querySelectorAll<HTMLAnchorElement>("[data-toc-link]").forEach((link) => {
		links.set(link.dataset.tocLink!, link);
	});

	const headings = [...links.keys()]
		.map((id) => document.getElementById(id))
		.filter((el): el is HTMLElement => el !== null);
	if (!headings.length) return;

	// Ids seen in the band, in document order, so the topmost one wins.
	const visible = new Set<string>();
	const order = headings.map((h) => h.id);

	const setActive = (id: string | null) => {
		links.forEach((link, key) => {
			link.toggleAttribute("data-active", key === id);
			if (key === id) link.setAttribute("aria-current", "true");
			else link.removeAttribute("aria-current");
		});
	};

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) visible.add(entry.target.id);
				else visible.delete(entry.target.id);
			});

			const active = order.find((id) => visible.has(id));
			// Past the last heading nothing is in the band; keep the last one lit.
			if (active) setActive(active);
		},
		{ rootMargin: `-${HEADER_OFFSET}px 0px -70% 0px` },
	);

	headings.forEach((heading) => observer.observe(heading));

	// Clicking a link should light it immediately rather than waiting for the scroll.
	links.forEach((link, id) => {
		link.addEventListener("click", () => setActive(id));
	});
}

function initAllTocs() {
	document.querySelectorAll<HTMLElement>("[data-toc]").forEach(initToc);
}

initAllTocs();
document.addEventListener("astro:page-load", initAllTocs);
