import gsap from "gsap";

/**
 * The scripted cursor that travels across a CreatorsAI panel.
 *
 * The panels are authored at their design size on a fixed 668x680 stage and
 * CSS-scaled to fit each breakpoint, so the cursor's own coordinates are
 * *unscaled stage pixels*. To aim at something: measure it against the stage,
 * then divide out the scale. That division is possible because `offsetWidth`
 * reports the pre-transform layout width while `getBoundingClientRect()` reports
 * the painted one.
 *
 * Positions resolve lazily, through function-based tween values. GSAP evaluates
 * those when a tween first renders rather than when it is built, which matters
 * because the stage's scale follows the viewport — a timeline assembled at load
 * time would otherwise keep aiming at wherever things were back then. The
 * harness calls `invalidate()` before every play so a resize is picked up.
 *
 * The fingertip offset lives in CSS (see DemoCursor.astro), so everything here
 * can treat the element's origin as the point that touches things — and the click
 * ring, which is centred on that origin, lands on the same point.
 */

/**
 * A fraction across a target, or a function returning one.
 *
 * The function form is for a fraction that depends on layout — it is resolved
 * with the rest of the aim, i.e. when the tween first renders, so it picks up the
 * breakpoint the demo is actually playing at.
 */
type Fraction = number | (() => number);

export interface AimOptions {
	/** Aim at a fraction across/down the target instead of its centre. */
	at?: { x?: Fraction; y?: Fraction };
}

export interface MoveOptions extends AimOptions {
	duration?: number;
	ease?: string;
}

/** Seconds a hop between two targets takes. */
export const HOP = 0.85;

/**
 * Where the cursor parks before a demo starts, in unscaled stage pixels — below
 * and right of the collage, so it travels *into* the UI on its first move rather
 * than appearing on top of it.
 */
const HOME = { x: 560, y: 620 };

export function createPointer(stage: HTMLElement, el: HTMLElement, ring: HTMLElement) {
	/** Painted width over layout width — the fit-to-breakpoint scale on the stage. */
	const scale = () => stage.getBoundingClientRect().width / stage.offsetWidth || 1;

	/** A target's aim point, in unscaled stage pixels. */
	function aim(target: Element, { x: fx = 0.5, y: fy = 0.5 }: NonNullable<AimOptions["at"]> = {}) {
		const stageBox = stage.getBoundingClientRect();
		const box = target.getBoundingClientRect();
		const s = scale();
		const f = (v: Fraction) => (typeof v === "function" ? v() : v);
		return {
			x: (box.left + box.width * f(fx) - stageBox.left) / s,
			y: (box.top + box.height * f(fy) - stageBox.top) / s,
		};
	}

	return {
		el,
		ring,

		/**
		 * Tween vars that park the cursor off to one side, hidden and unpressed.
		 *
		 * Vars rather than a finished tween because the caller feeds them to its own
		 * `timeline.set()`. `gsap.set()` would apply the moment it was written,
		 * which for a timeline built up front means before the demo has started.
		 */
		homeVars() {
			return { autoAlpha: 0, scale: 1, x: HOME.x, y: HOME.y };
		},

		/** The ring's resting state: hidden and collapsed, ready to pulse out. */
		ringVars() {
			return { autoAlpha: 0, scale: 0.3 };
		},

		fadeIn(duration = 0.25) {
			return gsap.to(el, { autoAlpha: 1, duration, ease: "power1.out" });
		},

		fadeOut(duration = 0.35) {
			return gsap.to(el, { autoAlpha: 0, duration, ease: "power1.out" });
		},

		/** Glide the tip onto a target. */
		moveTo(target: Element, { duration = HOP, ease = "power3.inOut", at }: MoveOptions = {}) {
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
				.to(el, { scale: 0.82, duration: duration * 0.4, ease: "power2.in" })
				.to(el, { scale: 1, duration: duration * 0.6, ease: "power2.out" });
		},

		/**
		 * Press and hold — the start of a drag, released separately.
		 *
		 * The thing being dragged is animated alongside this; give both the same
		 * duration and ease and they stay locked together, because each is a linear
		 * function of the same eased progress.
		 */
		grab(duration = 0.12) {
			return gsap.to(el, { scale: 0.8, duration, ease: "power2.in" });
		},

		release(duration = 0.18) {
			return gsap.to(el, { scale: 1, duration, ease: "power2.out" });
		},

		/** The ring that pulses out from the contact point. */
		ripple(duration = 0.55) {
			return gsap.fromTo(
				ring,
				{ scale: 0.3, autoAlpha: 0.9 },
				{ scale: 1.7, autoAlpha: 0, duration, ease: "power2.out" },
			);
		},

		/**
		 * Hop onto a target and click it: the arrow dips as it arrives and the ring
		 * pulses out from under it. The dip starts just before the hop lands, which
		 * is what stops the two reading as separate moves.
		 */
		click(target: Element, { at, duration, ease }: MoveOptions = {}) {
			return gsap
				.timeline()
				.add(this.moveTo(target, { at, duration, ease }))
				.add(this.press(), ">-0.05")
				.add(this.ripple(), "<");
		},
	};
}

export type Pointer = ReturnType<typeof createPointer>;
