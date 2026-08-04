import gsap from "gsap";

/**
 * The hand cursor that travels across the workflow mockup.
 *
 * The mockup is authored on the app's 1440x900 canvas and CSS-scaled to fit the
 * hero, so the cursor's own coordinates are *unscaled stage pixels*. To aim at
 * something: measure it against the stage, then divide out the scale. That
 * division is possible because `offsetWidth` reports the pre-transform layout
 * width while `getBoundingClientRect()` reports the painted one.
 *
 * Positions resolve lazily, through function-based tween values. GSAP evaluates
 * those when a tween first renders rather than when it is built, which matters
 * because the stage's scale follows the viewport — a timeline assembled at load
 * time would otherwise keep aiming at wherever things were back then.
 *
 * The fingertip offset lives in CSS (`.wf-pointer > img`), so everything here can
 * treat the element's origin as the point that touches things.
 */

export interface AimOptions {
	/** Aim at a fraction across/down the target instead of its centre. */
	at?: { x?: number; y?: number };
}

export interface MoveOptions extends AimOptions {
	duration?: number;
	ease?: string;
}

export function createPointer(stage: HTMLElement, el: HTMLElement) {
	/** Painted width over layout width — the fit-to-container scale on `.wf-stage`. */
	const scale = () => stage.getBoundingClientRect().width / stage.offsetWidth;

	/** A target's aim point, in unscaled stage pixels. */
	function aim(target: Element, { x: fx = 0.5, y: fy = 0.5 }: NonNullable<AimOptions["at"]> = {}) {
		const stageBox = stage.getBoundingClientRect();
		const box = target.getBoundingClientRect();
		const s = scale();
		return {
			x: (box.left + box.width * fx - stageBox.left) / s,
			y: (box.top + box.height * fy - stageBox.top) / s,
		};
	}

	return {
		el,

		/**
		 * Tween vars that put the fingertip on a target without travelling there —
		 * for parking the cursor where a timeline begins.
		 *
		 * Vars rather than a finished tween because the caller feeds them to its own
		 * `timeline.set()`. `gsap.set()` would apply the moment it was written,
		 * which for a timeline built up front means before the story has started.
		 */
		aimVars(target: Element, at?: AimOptions["at"]) {
			return {
				x: () => aim(target, at).x,
				y: () => aim(target, at).y,
				scale: 1,
			};
		},

		fadeIn(duration = 0.35) {
			return gsap.to(el, { opacity: 1, duration, ease: "power1.out" });
		},

		/** Glide the fingertip onto a target. */
		moveTo(target: Element, { duration = 0.7, ease = "power2.inOut", at }: MoveOptions = {}) {
			return gsap.to(el, {
				x: () => aim(target, at).x,
				y: () => aim(target, at).y,
				duration,
				ease,
			});
		},

		/** The press-and-release dip that reads as a click. */
		press(duration = 0.24) {
			return gsap
				.timeline()
				.to(el, { scale: 0.78, duration: duration * 0.4, ease: "power2.in" })
				.to(el, { scale: 1, duration: duration * 0.6, ease: "power2.out" });
		},

		/** Press and hold — the start of a drag, released separately. */
		grab(duration = 0.12) {
			return gsap.to(el, { scale: 0.8, duration, ease: "power2.in" });
		},

		release(duration = 0.18) {
			return gsap.to(el, { scale: 1, duration, ease: "power2.out" });
		},

		/**
		 * Slide the cursor sideways while it holds something.
		 *
		 * The thing being dragged is animated separately; give both the same
		 * duration and ease and they stay locked together, because each is a linear
		 * function of the same eased progress. Distance is resolved lazily so it can
		 * be measured off the element at the moment the drag starts.
		 */
		dragBy(dx: () => number, { duration = 0.9, ease = "power2.inOut" }: Omit<MoveOptions, "at"> = {}) {
			return gsap.to(el, { x: () => `+=${dx()}`, duration, ease });
		},
	};
}

export type Pointer = ReturnType<typeof createPointer>;
