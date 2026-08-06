import { DESKTOP_MIN } from "../breakpoints";

/**
 * Keeps the frosted look on the stacked feature cards from compounding.
 */
const SOLID_OFFSET = 1;
const CONTENT_OFFSET = 2;

let cards: HTMLElement[] = [];
let stickyTops: number[] = [];
let fadeDistance = 480;
let frame = 0;
let listening = false;
const painted = new WeakMap<HTMLElement, string>();

const isStacking = () => window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`).matches;

function measure() {
	stickyTops = cards.map((card) => parseFloat(getComputedStyle(card).top) || 0);
	fadeDistance = Math.min(480, window.innerHeight * 0.6);
}

function apply(card: HTMLElement, solid: number, faded: number) {
	const solidValue = solid.toFixed(3);
	const fadedValue = faded.toFixed(3);
	const key = `${solidValue} ${fadedValue}`;
	if (painted.get(card) === key) return;
	painted.set(card, key);
	card.style.setProperty("--solid", solidValue);
	card.style.setProperty("--faded", fadedValue);
	card.toggleAttribute("data-solid", solid >= 1);
}

function stackProgress(index: number): number {
	const card = cards[index];
	if (!card) return 0;
	// Distance the card still has to travel before it pins. Negative once it has,
	// which the clamp reads as fully stacked.
	const remaining = card.getBoundingClientRect().top - stickyTops[index];
	return Math.min(1, Math.max(0, 1 - remaining / fadeDistance));
}

function paint() {
	frame = 0;
	if (!isStacking()) {
		// Below `lg` the cards are in normal flow — nothing overlaps, so nothing
		// needs to go solid or empty out.
		for (const card of cards) apply(card, 0, 0);
		return;
	}

	cards.forEach((card, i) => {
		apply(card, stackProgress(i + SOLID_OFFSET), stackProgress(i + CONTENT_OFFSET));
	});
}

function schedule() {
	if (!frame) frame = requestAnimationFrame(paint);
}

function onResize() {
	measure();
	schedule();
}

function init() {
	cards = Array.from(document.querySelectorAll<HTMLElement>("[data-feature-card]"));
	if (!cards.length) return;

	measure();
	paint();

	if (listening) return;
	listening = true;
	window.addEventListener("scroll", schedule, { passive: true });
	window.addEventListener("resize", onResize);
}

init();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", init);
