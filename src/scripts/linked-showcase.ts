/**
 * A list of items each tied to a visual: the active item is highlighted and its visual
 * shown, advancing on its own and on click. Used by the landing pages' "example briefs"
 * and "what matters" sections.
 *
 * Markup: `data-showcase` on the root (optional `data-interval` in ms), `role="tab"`
 * buttons with `data-showcase-item`, and `data-showcase-panel` visuals in the same order.
 * Optional `data-showcase-prev` / `data-showcase-next` buttons step back and forward.
 * The server renders item 0 active, so without JS the first pairing shows as drawn. With
 * reduced motion it never advances on its own, and the swap is instant.
 */
const DEFAULT_INTERVAL = 4500;

function initShowcases() {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	document.querySelectorAll<HTMLElement>("[data-showcase]").forEach((root) => {
		if (root.dataset.showcaseReady === "true") return;
		const items = Array.from(root.querySelectorAll<HTMLElement>("[data-showcase-item]"));
		const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-showcase-panel]"));
		if (items.length < 2 || items.length !== panels.length) return;
		root.dataset.showcaseReady = "true";

		const interval = Number(root.dataset.interval) || DEFAULT_INTERVAL;
		let active = 0;
		let timer: number | undefined;
		let paused = false;

		const show = (index: number) => {
			active = (index + items.length) % items.length;
			items.forEach((item, i) => {
				const on = i === active;
				item.setAttribute("aria-selected", String(on));
				item.tabIndex = on ? 0 : -1;
				item.toggleAttribute("data-active", on);
			});
			panels.forEach((panel, i) => {
				const on = i === active;
				panel.toggleAttribute("data-active", on);
				panel.setAttribute("aria-hidden", String(!on));
			});
			// Restart the progress bar on the newly active item.
			root.style.setProperty("--showcase-interval", `${interval}ms`);
		};

		const schedule = () => {
			window.clearInterval(timer);
			if (reduceMotion || paused) return;
			timer = window.setInterval(() => show(active + 1), interval);
		};

		items.forEach((item, i) => {
			item.addEventListener("click", () => {
				show(i);
				schedule();
			});
			item.addEventListener("keydown", (event) => {
				const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
				if (!step) return;
				event.preventDefault();
				show(active + step);
				items[active].focus();
				schedule();
			});
		});

		// Optional arrows, for layouts that show one item at a time.
		root.querySelector("[data-showcase-prev]")?.addEventListener("click", () => {
			show(active - 1);
			schedule();
		});
		root.querySelector("[data-showcase-next]")?.addEventListener("click", () => {
			show(active + 1);
			schedule();
		});

		const pause = () => {
			paused = true;
			root.toggleAttribute("data-paused", true);
			window.clearInterval(timer);
		};
		const resume = () => {
			paused = false;
			root.toggleAttribute("data-paused", false);
			schedule();
		};
		root.addEventListener("mouseenter", pause);
		root.addEventListener("mouseleave", resume);
		root.addEventListener("focusin", pause);
		root.addEventListener("focusout", (event) => {
			if (!root.contains(event.relatedTarget as Node | null)) resume();
		});

		// Only cycle while the section is on screen, so it starts from the first item.
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					if (!root.dataset.showcaseSeen) {
						root.dataset.showcaseSeen = "true";
						show(0);
					}
					schedule();
				} else window.clearInterval(timer);
			},
			{ threshold: 0.35 },
		);
		observer.observe(root);
		show(0);
	});
}

initShowcases();
document.addEventListener("astro:page-load", initShowcases);
