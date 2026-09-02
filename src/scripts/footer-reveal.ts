import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer reveal, once per page load: the bolt wipes in top-down via
 * clip-path while the wordmark slides up into place, both on one trigger.
 */
function initFooterReveal() {
	const footer = document.querySelector<HTMLElement>("[data-footer]");
	if (!footer || footer.dataset.footerRevealReady === "true") return;

	const bolt = footer.querySelector<HTMLElement>("[data-footer-bolt]");
	const wordmarks = footer.querySelectorAll<HTMLElement>("[data-footer-wordmark]");
	if (!bolt || !wordmarks.length) return;
	footer.dataset.footerRevealReady = "true";

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	gsap
		.timeline({ scrollTrigger: { trigger: footer, start: "top 80%", once: true } })
		.fromTo(bolt, { clipPath: "inset(0% 0 100% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 2, ease: "power2.inOut" }, 0)
		.fromTo(wordmarks, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0);
}

initFooterReveal();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initFooterReveal);
