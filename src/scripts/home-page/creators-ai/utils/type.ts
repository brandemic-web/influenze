import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

/**
 * Character-by-character typing for a field whose value is authored in the markup.
 *
 * Deliberately *not* `scripts/gsap/typeText`, which is the better tool wherever
 * it fits: it tweens a counter and writes `textContent`, so it seeks and reverses
 * cleanly. These fields can't use it — the lookalike handle authors its `@` as a
 * coloured `<span>`, and writing `textContent` would flatten that markup away.
 * SplitText keeps the nodes and reveals their characters in place instead.
 *
 * The split happens once, when the beat is built. The chars it hands back are
 * real elements, so hiding them with `display: none` is what actually removes
 * them from the line — opacity alone would leave the field sitting at its full
 * typed width from the first frame.
 */

/** Seconds between characters. */
export const TYPE_SPEED = 0.055;

/** Splits a field's text into characters and returns them ready to be revealed. */
export function splitChars(el: HTMLElement) {
	return new SplitText(el, { type: "chars" }).chars;
}

/** Where split characters sit before they are typed. */
export const CHARS_HIDDEN = { display: "none", opacity: 0 };

/**
 * Reveal characters at a typing cadence. `speed` scales the gap between them, so
 * a longer string can be typed brisker without restating the base cadence.
 */
export function typeChars(chars: Element[], speed = TYPE_SPEED) {
	return gsap.to(chars, {
		display: "inline-block",
		opacity: 1,
		duration: 0.01,
		stagger: speed,
	});
}

/** The caret blinking a few times, the way one rests at the end of a typed word. */
export function blinkCaret(caret: HTMLElement, times = 3) {
	return gsap.to(caret, {
		autoAlpha: 0,
		duration: 0.01,
		repeat: times,
		yoyo: true,
		repeatDelay: 0.25,
	});
}
