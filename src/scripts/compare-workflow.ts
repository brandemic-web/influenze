import Swiper from "swiper";
import { A11y, FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

/**
 * The compare page's workflow timeline as a free-scrolling Swiper. Without JS the
 * same markup is a native sideways scroller (see the `:not(.swiper-initialized)`
 * rule in WorkflowCoverage.astro), so the cards are always reachable.
 *
 * The left inset is set in rem on the 1728 grid, so it is converted to px on every
 * resize — Swiper offsets take pixels.
 */
const INSET_REM = { mobile: 1.5, desktop: 7.375 };

function insetPx() {
	const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
	const desktop = window.matchMedia("(min-width: 1024px)").matches;
	return (desktop ? INSET_REM.desktop : INSET_REM.mobile) * rootPx;
}

function initWorkflowSwiper() {
	const el = document.querySelector<HTMLElement>("[data-workflow-swiper]");
	if (!el || el.classList.contains("swiper-initialized")) return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const swiper = new Swiper(el, {
		modules: [A11y, FreeMode, Keyboard, Mousewheel],
		slidesPerView: "auto",
		spaceBetween: 0,
		slidesOffsetBefore: insetPx(),
		slidesOffsetAfter: insetPx(),
		speed: reduceMotion ? 0 : 400,
		grabCursor: true,
		freeMode: { enabled: true, momentum: !reduceMotion },
		mousewheel: { forceToAxis: true },
		keyboard: { enabled: true, onlyInViewport: true },
		a11y: { enabled: true },
		watchOverflow: true,
	});

	swiper.on("resize", () => {
		swiper.params.slidesOffsetBefore = insetPx();
		swiper.params.slidesOffsetAfter = insetPx();
		swiper.update();
	});
}

initWorkflowSwiper();
document.addEventListener("astro:page-load", initWorkflowSwiper);
