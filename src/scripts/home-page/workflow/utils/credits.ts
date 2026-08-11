import gsap from "gsap";
import { formatCredits } from "../../../../data/workflowMockup";

/** The nav credits chip, spending as the story goes. */

const value = (screen: HTMLElement) => screen.querySelector<HTMLElement>("[data-wf-credits]");

/** The tick in flight on a chip, if there is one. */
const running = new WeakMap<HTMLElement, gsap.core.Timeline>();

function stop(el: HTMLElement) {
	running.get(el)?.kill();
	running.delete(el);
}

/** Put a layer's chip back to a balance outright, for a beat's own reset. */
export function setCredits(screen: HTMLElement, balance: number) {
	const el = value(screen);
	if (!el) return;
	stop(el);
	el.textContent = formatCredits(balance);
}

/**
 * Counts a chip down from one balance to the next. Built once with the beat and
 * fired via `tl.call()`, so the beat spends no time on it. The number is a text
 * node, so the tween runs on a proxy and writes the snapped string each update.
 * The pill squeezes underneath — at hero scale, changing digits are easy to miss.
 */
export function spendCredits(screen: HTMLElement, from: number, to: number, duration = 0.3) {
	const el = value(screen);
	if (!el) return () => {};
	const pill = screen.querySelector<HTMLElement>("[data-wf-credits-pill]");

	return () => {
		// A second pass round the loop starts over from `from`, so anything left
		// running from the first is dropped rather than raced.
		stop(el);
		el.textContent = formatCredits(from);

		const balance = { at: from };
		const tl = gsap.timeline({ onComplete: () => running.delete(el) }).to(balance, {
			at: to,
			duration,
			ease: "power2.out",
			snap: { at: 1 },
			onUpdate: () => {
				el.textContent = formatCredits(Math.round(balance.at));
			},
		});

		if (pill) {
			tl.fromTo(
				pill,
				{ scale: 1 },
				{ scale: 1.06, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "center" },
				0
			);
		}

		running.set(el, tl);
	};
}
