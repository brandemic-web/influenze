import gsap from "gsap";

/**
 * The hand cursor that travels across the workflow mockup.
 *
 * The mockup is authored on the app's 1440x900 canvas and CSS-scaled to fit the
 * hero, so cursor coordinates are *unscaled stage pixels*. Positions resolve lazily
 * through function-based tween values: the stage's scale follows the viewport, so a
 * timeline built at load time would keep aiming at stale coordinates.
 *
 * The fingertip offset lives in CSS (`.wf-pointer > img`), so the element's origin
 * can be treated as the point that touches things.
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
 * One element's own transform, as a matrix. `transform` alone is not enough to read:
 * `rotate` and `scale` are separate CSS properties, and an element carrying only
 * those reports `transform: none` — silently losing the stage's canvas scale.
 * Composed in CSS's order (rotate, scale, transform); `translate` is dropped anyway.
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
	 * Screen space back into stage space: every transform from the stage up to the
	 * root, multiplied and inverted, translation dropped.
	 *
	 * A full matrix, not painted-width-over-layout-width — that ratio is identical
	 * until something above the stage is rotated, and the landscape viewer rotates
	 * the mockup a quarter turn on iOS Safari, where a real orientation lock is
	 * refused. A rect is axis-aligned, so the ratio came back as height/width and the
	 * cursor moved down where it should have moved right.
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

		// Centres, not edges: an affine map takes a box's centre to the centre of its
		// image's bounding box, so a centre survives rotation where `left`/`top` do not.
		const offset = local(
			box.left + box.width / 2 - (stageBox.left + stageBox.width / 2),
			box.top + box.height / 2 - (stageBox.top + stageBox.height / 2),
		);
		// Extents come back through the same map, or a fraction across the target
		// means nothing in stage space.
		const size = local(box.width, box.height);

		return {
			x: stage.offsetWidth / 2 + offset.x + (fx - 0.5) * Math.abs(size.x),
			y: stage.offsetHeight / 2 + offset.y + (fy - 0.5) * Math.abs(size.y),
		};
	}

	return {
		el,

		/**
		 * Park the fingertip on a target without travelling there. Vars, not a tween:
		 * the caller feeds them to `timeline.set()`, since `gsap.set()` would apply
		 * when written — before the story has started.
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
		 * Slide the cursor sideways while it holds something. The dragged thing is
		 * animated separately — same duration and ease keeps the two locked together.
		 */
		dragBy(dx: () => number, { duration = 0.9, ease = "power2.inOut" }: Omit<MoveOptions, "at"> = {}) {
			return gsap.to(el, { x: () => `+=${dx()}`, duration, ease });
		},
	};
}

export type Pointer = ReturnType<typeof createPointer>;
