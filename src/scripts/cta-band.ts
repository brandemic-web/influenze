import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * CTA band animation. Two phases:
 *   1. Scroll-triggered intro (once): heading -> floats fly in -> button.
 *   2. Ongoing mouse-driven parallax float, enabled only after the intro.
 *
 * Per-element tuning comes from data attributes in CtaBand.astro:
 *   data-fx / data-fy -> horizontal / vertical parallax travel (px)
 *   data-fr           -> extra rotation added to the element's designed tilt (deg)
 */

interface FloatSetter {
	baseRotation: number;
	fx: number;
	fy: number;
	fr: number;
	xTo: gsap.QuickToFunc;
	yTo: gsap.QuickToFunc;
	rTo: gsap.QuickToFunc;
}

// Mouse-driven parallax float. Each image sways from its DESIGNED tilt
// (baseRotation) so the layout's rotations are preserved.
function initFloating(section: HTMLElement, floats: HTMLElement[]) {
	const setters: FloatSetter[] = floats.map((el) => ({
		baseRotation: gsap.getProperty(el, "rotation") as number,
		fx: Number(el.dataset.fx) || 0,
		fy: Number(el.dataset.fy) || 0,
		fr: Number(el.dataset.fr) || 0,
		xTo: gsap.quickTo(el, "x", { duration: 0.6, ease: "power2.out" }),
		yTo: gsap.quickTo(el, "y", { duration: 0.6, ease: "power2.out" }),
		rTo: gsap.quickTo(el, "rotation", { duration: 0.6, ease: "power2.out" }),
	}));

	section.addEventListener("mousemove", (e) => {
		const { width, height, left, top } = section.getBoundingClientRect();
		const x = (e.clientX - left - width / 2) / width;
		const y = (e.clientY - top - height / 2) / height;
		setters.forEach((s) => {
			s.xTo(x * s.fx);
			s.yTo(y * s.fy);
			s.rTo(s.baseRotation + x * s.fr);
		});
	});

	section.addEventListener("mouseleave", () => {
		setters.forEach((s) => {
			s.xTo(0);
			s.yTo(0);
			s.rTo(s.baseRotation);
		});
	});
}

function initCtaAnimation() {
	const section = document.querySelector<HTMLElement>("[data-cta-section]");
	if (!section || section.dataset.ctaReady === "true") return;
	section.dataset.ctaReady = "true";

	const heading = section.querySelector<HTMLElement>("[data-cta-heading]");
	const button = section.querySelector<HTMLElement>("[data-cta-button]");
	const floats = gsap.utils.toArray<HTMLElement>(".cta-float");

	// Reduced motion: leave everything in its natural, visible state.
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const tl = gsap.timeline({
		scrollTrigger: { trigger: section, start: "top 70%", once: true },
		defaults: { ease: "power3.out" },
	});

	if (heading) {
		tl.from(heading, { opacity: 0, y: 20, duration: 0.6 });
	}

	// Determine each float's side (left/right) relative to the section's
	// horizontal center, so it flies in from that side rather than a fixed direction.
	const sectionRect = section.getBoundingClientRect();
	const sectionCenterX = sectionRect.left + sectionRect.width / 2;

	floats.forEach((el) => {
		const rect = el.getBoundingClientRect();
		const elCenterX = rect.left + rect.width / 2;
		const isLeft = elCenterX < sectionCenterX;
		el.dataset.entryX = isLeft ? "-200" : "200";
	});

	// Floats drop in from their own side (left or right) with opacity;
	// rotation is left untouched so the designed CSS tilts remain the resting state.
	tl.from(
		floats,
		{
			opacity: 0,
			x: (i, target) => Number(target.dataset.entryX) || 0,
			y:-100,
			duration: 1.5,
			stagger: 0.12,
		},
		heading ? "-=0.3" : 0
	);

	if (button) {
		tl.from(button, { opacity: 0, y: 20, duration: 0.6 }, "-=0.8");
	}

	// Enable the parallax float only after the intro finishes.
	tl.add(() => initFloating(section, floats));
}

initCtaAnimation();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initCtaAnimation);