import gsap from "gsap";
import { HERO_WORDS } from "../data/heroWords";

/**
 * Cycles the noun in the hero headline. Each word leaves upward and the next arrives
 * from below — the same slide-and-fade vocabulary as the reveals. The markup already
 * holds `HERO_WORDS[0]`, so without this the headline just stays on that word.
 */
const HOLD = 1.9;
const OUT = 0.3;
const IN = 0.36;
const RISE = "0.12em";

function initHeroWords() {
	const el = document.querySelector<HTMLElement>("[data-hero-word]");
	if (!el || el.dataset.heroWordsReady === "true") return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	if (HERO_WORDS.length < 2) return;

	el.dataset.heroWordsReady = "true";

	const tl = gsap.timeline({ repeat: -1 });
	// Starts from the word already in the markup, so the first step is its exit.
	for (let i = 1; i <= HERO_WORDS.length; i += 1) {
		const next = HERO_WORDS[i % HERO_WORDS.length];
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
