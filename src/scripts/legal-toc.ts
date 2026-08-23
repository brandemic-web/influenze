/**
 * Marks the legal document's on-screen section in the sticky contents rail.
 *
 * The observer's root is inset from the top by the header height and from the
 * bottom by most of the viewport, leaving a thin band just under the header;
 * whichever section heading sits in that band is the one being read. Headings
 * are the targets rather than whole sections, since a single clause list can be
 * taller than the viewport and would otherwise never leave the band.
 */
const HEADER_OFFSET = 128; // px — clears the fixed header, matches `scroll-mt-32`

function initLegalToc() {
	const toc = document.querySelector<HTMLElement>("[data-legal-toc]");
	if (!toc || toc.dataset.tocReady === "true") return;
	toc.dataset.tocReady = "true";

	const links = new Map<string, HTMLAnchorElement>();
	toc.querySelectorAll<HTMLAnchorElement>("[data-toc-link]").forEach((link) => {
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

initLegalToc();
document.addEventListener("astro:page-load", initLegalToc);
