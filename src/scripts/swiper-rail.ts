import Swiper from "swiper";
import { A11y, FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { DESKTOP_MIN } from "./breakpoints";

/**
 * Free-scrolling card rows — the compare workflow timeline, the alternative page's
 * "why" cards. Markup: `data-swiper-rail` on a `.swiper` holding a `.swiper-wrapper`
 * of `.swiper-slide`s, with `data-inset-mobile` / `data-inset-desktop` giving the
 * first card's left inset in rem, `data-gap` the space between cards in rem (else the
 * slides carry their own padding). `data-centered="<n>"` makes it a carousel that opens
 * centred on slide n and snaps card by card, held to the ends so it never shows empty
 * space past the first or last card. `data-rail-from="lg"` runs it only from lg up, so
 * the component can lay the same markup out differently below. Without JS the
 * component's own CSS makes the same markup a native sideways scroller.
 *
 * Insets are rem on the 1728 grid, converted to px on every resize — Swiper offsets
 * take pixels.
 */
function insetPx(el: HTMLElement) {
	const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
	const desktop = window.matchMedia("(min-width: 1024px)").matches;
	const rem = Number(desktop ? el.dataset.insetDesktop : el.dataset.insetMobile) || 0;
	return rem * rootPx;
}

const remPx = (el: HTMLElement, key: "gap") => {
	const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
	return (Number(el.dataset[key]) || 0) * rootPx;
};

const desktopQuery = () => window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
const rails = new Map<HTMLElement, Swiper>();

function initRails() {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const desktop = desktopQuery().matches;

	document.querySelectorAll<HTMLElement>("[data-swiper-rail]").forEach((el) => {
		const desktopOnly = el.dataset.railFrom === "lg";
		// A desktop-only rail below lg: tear it down so the component's own layout shows.
		if (desktopOnly && !desktop) {
			rails.get(el)?.destroy(true, true);
			rails.delete(el);
			return;
		}
		if (el.classList.contains("swiper-initialized")) return;

		const centeredOn = el.dataset.centered === undefined ? undefined : Number(el.dataset.centered);
		const centered = Number.isFinite(centeredOn);

		const swiper = new Swiper(el, {
			modules: [A11y, FreeMode, Keyboard, Mousewheel],
			slidesPerView: "auto",
			spaceBetween: remPx(el, "gap"),
			slidesOffsetBefore: centered ? 0 : insetPx(el),
			slidesOffsetAfter: centered ? 0 : insetPx(el),
			centeredSlides: centered,
			centeredSlidesBounds: centered,
			initialSlide: centered ? centeredOn : 0,
			speed: reduceMotion ? 0 : 400,
			grabCursor: true,
			freeMode: { enabled: !centered, momentum: !reduceMotion },
			mousewheel: { forceToAxis: true },
			keyboard: { enabled: true, onlyInViewport: true },
			a11y: { enabled: true },
			watchOverflow: true,
		});

		rails.set(el, swiper);

		swiper.on("resize", () => {
			swiper.params.spaceBetween = remPx(el, "gap");
			if (centered) {
				swiper.update();
				return;
			}
			swiper.params.slidesOffsetBefore = insetPx(el);
			swiper.params.slidesOffsetAfter = insetPx(el);
			swiper.update();
		});
	});
}

initRails();
document.addEventListener("astro:page-load", initRails);
// Crossing lg builds or removes the desktop-only rails.
desktopQuery().addEventListener("change", initRails);
