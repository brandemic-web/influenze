import gsap from "gsap";

/**
 * Cycles the noun in the hero headline. Each word leaves upward and the next arrives
 * from below — the same slide-and-fade vocabulary as the reveals. The markup already
 * holds the first word (and the full list in `data-hero-words`, sourced from Sanity
 * with a local fallback — see HomeHero.astro), so without this the headline just
 * stays on that word.
 */
const HOLD = 1.9;
const OUT = 0.3;
const IN = 0.36;
const RISE = "0.12em";

function initHeroWords() {
	const el = document.querySelector<HTMLElement>("[data-hero-word]");
	if (!el || el.dataset.heroWordsReady === "true") return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const words: string[] = JSON.parse(el.dataset.heroWords ?? "[]");
	if (words.length < 2) return;

	el.dataset.heroWordsReady = "true";

	const tl = gsap.timeline({ repeat: -1 });
	// Starts from the word already in the markup, so the first step is its exit.
	for (let i = 1; i <= words.length; i += 1) {
		const next = words[i % words.length];
		tl.to(el, { opacity: 0, y: `-${RISE}`, duration: OUT, ease: "power2.in" }, `+=${HOLD}`)
			.set(el, { y: RISE })
			.call(() => {
				el.textContent = next;
			})
			.to(el, { opacity: 1, y: 0, duration: IN, ease: "power2.out" });
	}
}

initHeroWords();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initHeroWords);
