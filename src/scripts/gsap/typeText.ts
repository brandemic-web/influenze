import gsap from "gsap";

export interface TypeTextOptions {
	/** Seconds per character. Ignored when `duration` is given. */
	speed?: number;
	/** Total time (s) for the whole string, however long it is. */
	duration?: number;
	/** GSAP ease. Linear by default, which is what reads as typing. */
	ease?: string;
}

/**
 * Reveal `text` inside `el` one character at a time, the way someone types it.
 *
 * Tweens a plain counter rather than the DOM so the result is a normal tween —
 * it can be nested, eased, seeked and reversed like anything else, which is what
 * lets a timeline jump straight to its finished state. Snapping to whole
 * characters means the element is only rewritten when the visible text changes.
 */
export function typeText(el: HTMLElement, text: string, options: TypeTextOptions = {}) {
	const { speed = 0.055, duration = text.length * speed, ease = "none" } = options;
	const cursor = { chars: 0 };

	return gsap.to(cursor, {
		chars: text.length,
		duration,
		ease,
		snap: { chars: 1 },
		onUpdate: () => {
			el.textContent = text.slice(0, cursor.chars);
		},
	});
}
