import gsap from "gsap";

/**
 * The FAQ list as an accordion: opening one closes whichever was open.
 *
 * `<details>` cannot be transitioned on its own — a closed one is `display: none`,
 * so there is no height to animate from — and the CSS that can (`::details-content`
 * with `interpolate-size`) is not broadly supported yet. So the panel keeps a
 * wrapper this can measure, and the toggle is driven here instead: opening sets
 * `open` first and grows the wrapper, closing shrinks it and only then drops
 * `open`, which is what keeps the collapse visible.
 *
 * With the script absent the markup is still a working set of native disclosures —
 * they just open independently and without the slide.
 */
const DURATION = 0.32;
const EASE = "power2.inOut";

function initFaq() {
	const list = document.querySelector<HTMLElement>("[data-faq-list]");
	if (!list || list.dataset.faqReady === "true") return;
	list.dataset.faqReady = "true";

	const items = gsap.utils.toArray<HTMLDetailsElement>("[data-faq]", list);
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const body = (item: HTMLDetailsElement) => item.querySelector<HTMLElement>("[data-faq-body]");
	const chevron = (item: HTMLDetailsElement) => item.querySelector<HTMLElement>("[data-faq-chevron]");

	// GSAP owns the chevron from here, so it can turn back while the panel is
	// still collapsing — `group-open:` would snap it only once `open` is dropped.
	for (const item of items) gsap.set(chevron(item), { rotate: item.open ? 180 : 0 });

	const collapse = (item: HTMLDetailsElement) => {
		const panel = body(item);
		if (!item.open || !panel) return;
		gsap.to(chevron(item), { rotate: 0, duration: DURATION, ease: EASE, overwrite: true });
		if (reduceMotion) {
			item.open = false;
			return;
		}
		gsap.to(panel, {
			height: 0,
			duration: DURATION,
			ease: EASE,
			overwrite: true,
			onComplete: () => {
				item.open = false;
				gsap.set(panel, { clearProps: "height" });
			},
		});
	};

	const expand = (item: HTMLDetailsElement) => {
		const panel = body(item);
		if (!panel) return;
		item.open = true;
		gsap.to(chevron(item), { rotate: 180, duration: DURATION, ease: EASE, overwrite: true });
		if (reduceMotion) return;
		gsap.fromTo(
			panel,
			{ height: 0 },
			{
				height: "auto",
				duration: DURATION,
				ease: EASE,
				overwrite: true,
				onComplete: () => gsap.set(panel, { clearProps: "height" }),
			},
		);
	};

	for (const item of items) {
		item.querySelector("summary")?.addEventListener("click", (event) => {
			// The native toggle would flip `open` before anything could animate.
			event.preventDefault();
			const wasOpen = item.open;
			for (const other of items) if (other !== item) collapse(other);
			if (wasOpen) collapse(item);
			else expand(item);
		});
	}
}

initFaq();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initFaq);

