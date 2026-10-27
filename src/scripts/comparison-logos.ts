/**
 * Swaps a competitor logo for its name when the image fails to load. Markup: an
 * `<img data-compare-logo>` followed by a hidden `[data-compare-logo-name]` sibling.
 * Without JS a broken logo still shows its alt text, which is the same name.
 */

function showName(img: HTMLImageElement) {
	const name = img.parentElement?.querySelector<HTMLElement>("[data-compare-logo-name]");
	if (!name) return;
	img.hidden = true;
	name.classList.remove("hidden");
}

function initLogos() {
	document.querySelectorAll<HTMLImageElement>("img[data-compare-logo]").forEach((img) => {
		if (img.dataset.logoReady === "true") return;
		img.dataset.logoReady = "true";

		// The error may already have fired before this script ran.
		if (img.complete && img.naturalWidth === 0) showName(img);
		else img.addEventListener("error", () => showName(img), { once: true });
	});
}

document.addEventListener("astro:page-load", initLogos);
