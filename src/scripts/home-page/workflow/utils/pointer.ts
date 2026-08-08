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

/**
 * One element's own transform, as a matrix.
 *
 * `transform` alone is not enough to ask for: `rotate`, `scale` and `translate` are
 * separate CSS properties, and this project reaches them through Tailwind's
 * utilities — `.wf-stage`'s fit-to-container scale is a `scale`, and the landscape
 * viewer's quarter turn is a `transform`. An element carrying only the former
 * reports `transform: none`, so reading that property by itself returns the identity
 * and silently loses the canvas scale.
 *
 * Composed in the order CSS applies them: rotate, then scale, then `transform`.
 * `translate` is left out because callers drop the translation anyway.
 */
function elementMatrix(node: HTMLElement) {
	const style = getComputedStyle(node);
	const parts: string[] = [];

	if (style.rotate !== "none") parts.push(`rotate(${style.rotate})`);
	// Computed `scale` is space-separated ("0.44" or "0.44 0.44"); the function form
	// this is parsed as wants commas.
	if (style.scale !== "none") parts.push(`scale(${style.scale.trim().split(/\s+/).join(",")})`);
	if (style.transform !== "none") parts.push(style.transform);

	return parts.length ? new DOMMatrix(parts.join(" ")) : new DOMMatrix();
}

export function createPointer(stage: HTMLElement, el: HTMLElement) {
	/**
	 * Screen space back into the stage's own space: every `transform` from the stage
	 * up to the root multiplied together and inverted, with the translation dropped
	 * because only directions and distances are mapped through it.
	 *
	 * Painted width over layout width used to stand in for this, which is the same
	 * number right up until something above the stage is rotated. The landscape
	 * viewer turns the mockup a quarter turn on devices that refuse a real
	 * orientation lock — iOS Safari, where `requestFullscreen` and
	 * `screen.orientation.lock` both reject, so the CSS rotation is the whole
	 * mechanism (see scripts/landscape-viewer). A rect is the axis-aligned box of the
	 * rotated result, so that ratio came back as the stage's *height* over its width
	 * and a screen-x delta landed on the stage's y: the cursor went down where it
	 * should have gone right. Android never showed it because the orientation lock
	 * succeeds there and nothing is rotated.
	 */
	function toStageSpace() {
		let m = new DOMMatrix();
		for (let node: HTMLElement | null = stage; node; node = node.parentElement) {
			m = elementMatrix(node).multiply(m);
		}
		m.e = 0;
		m.f = 0;
		return m.inverse();
	}

	/** A target's aim point, in unscaled stage pixels. */
	function aim(target: Element, { x: fx = 0.5, y: fy = 0.5 }: NonNullable<AimOptions["at"]> = {}) {
		const stageBox = stage.getBoundingClientRect();
		const box = target.getBoundingClientRect();
		const inv = toStageSpace();
		const local = (dx: number, dy: number) => inv.transformPoint(new DOMPoint(dx, dy));

		// Centres rather than edges: an affine map takes a box's centre to its image's
		// centre, and that is also the centre of the image's bounding box — so a centre
		// survives the rotation intact where `left`/`top` do not.
		const offset = local(
			box.left + box.width / 2 - (stageBox.left + stageBox.width / 2),
			box.top + box.height / 2 - (stageBox.top + stageBox.height / 2),
		);
		// The target's extents have to come back through the same map before a fraction
		// across it means anything in stage space.
		const size = local(box.width, box.height);

		return {
			x: stage.offsetWidth / 2 + offset.x + (fx - 0.5) * Math.abs(size.x),
			y: stage.offsetHeight / 2 + offset.y + (fy - 0.5) * Math.abs(size.y),
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
