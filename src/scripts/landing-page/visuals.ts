import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { typeText } from "../gsap/typeText";
import { prefersReducedMotion } from "../breakpoints";

gsap.registerPlugin(ScrollTrigger);

/**
 * The landing pages' graphics, played once as each scrolls into view. Every graphic ships
 * in its finished state — the counts read their targets, the search bar its full query —
 * so without JavaScript, or under reduced motion, the page is already complete.
 *
 *   data-count-to="450"   counts up from 0 to the number already in the element
 *   data-type-text        retypes its own text
 *   data-draw="x" | "y"   grows a connector from its start edge
 *   data-pop-group        staggers its `data-pop` children in
 *   data-float            drifts gently, forever (the hero mockup's floating cards)
 *   data-spin             turns slowly, forever; `data-counter-spin` children stay upright
 */
const START = "top 82%";

function once(el: HTMLElement, key: string): boolean {
	if (el.dataset[key] === "true") return false;
	el.dataset[key] = "true";
	return true;
}

function onEnter(trigger: Element, play: () => void) {
	ScrollTrigger.create({ trigger, start: START, once: true, onEnter: play });
}

function initVisuals() {
	if (prefersReducedMotion()) return;

	for (const el of document.querySelectorAll<HTMLElement>("[data-count-to]")) {
		if (!once(el, "countReady")) continue;
		const target = Number(el.dataset.countTo);
		if (!Number.isFinite(target)) continue;
		const counter = { value: 0 };
		el.textContent = "0";
		onEnter(el, () =>
			gsap.to(counter, {
				value: target,
				duration: 1.4,
				ease: "power2.out",
				snap: { value: 1 },
				onUpdate: () => {
					el.textContent = counter.value.toLocaleString("en-IN");
				},
			}),
		);
	}

	for (const el of document.querySelectorAll<HTMLElement>("[data-type-text]")) {
		if (!once(el, "typeReady")) continue;
		const text = el.textContent ?? "";
		el.textContent = "";
		onEnter(el, () => typeText(el, text, { speed: 0.04 }).delay(0.4));
	}

	for (const el of document.querySelectorAll<HTMLElement>("[data-draw]")) {
		if (!once(el, "drawReady")) continue;
		const axis = el.dataset.draw === "y" ? "scaleY" : "scaleX";
		gsap.set(el, { [axis]: 0 });
		onEnter(el, () => gsap.to(el, { [axis]: 1, duration: 1.6, ease: "power2.inOut" }));
	}

	for (const group of document.querySelectorAll<HTMLElement>("[data-pop-group]")) {
		if (!once(group, "popReady")) continue;
		const items = group.querySelectorAll<HTMLElement>(":scope > [data-pop], :scope > * > [data-pop]");
		if (!items.length) continue;
		gsap.set(items, { opacity: 0, y: 12, scale: 0.92 });
		onEnter(group, () =>
			gsap.to(items, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: "back.out(1.6)" }),
		);
	}

	for (const el of document.querySelectorAll<HTMLElement>("[data-float]")) {
		if (!once(el, "floatReady")) continue;
		gsap.to(el, {
			y: -8,
			duration: 2.4 + Math.random(),
			delay: Math.random(),
			ease: "sine.inOut",
			yoyo: true,
			repeat: -1,
		});
	}

	for (const el of document.querySelectorAll<HTMLElement>("[data-spin]")) {
		if (!once(el, "spinReady")) continue;
		const duration = 40;
		gsap.to(el, { rotation: 360, duration, ease: "none", repeat: -1 });
		gsap.to(el.querySelectorAll("[data-counter-spin]"), { rotation: -360, duration, ease: "none", repeat: -1 });
	}
}

initVisuals();
document.addEventListener("astro:page-load", initVisuals);
