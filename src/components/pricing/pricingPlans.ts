/**
 * Client-side behavior for the pricing plan panel (PricingPlans.astro).
 *
 * Two independent widgets live inside each `[data-plan-panel]`:
 *   1. A plan stepper whose bolt handle can be clicked (via dots), dragged, or
 *      driven with the keyboard, snapping to the nearest tier on release.
 *   2. An annual-billing toggle (currently visual only).
 *
 * The panel is entirely data-attribute driven: the markup ships the tier data
 * (serialized into `data-tiers`) and the script reads the DOM hooks documented
 * in PricingPlans.astro. No IDs or framework runtime are involved.
 */

// Tier data is serialized into `data-tiers` from PRICING_TIERS, so we reuse the
// source-of-truth type instead of re-declaring one that could drift out of sync.
import type { PricingTier } from "../../data/pricing";

/** Clamp a number to the inclusive [min, max] range. */
function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function initPlanStepper(panel: HTMLElement): void {
	const tiers: PricingTier[] = JSON.parse(panel.dataset.tiers ?? "[]");
	const dots = Array.from(
		panel.querySelectorAll<HTMLButtonElement>("[data-dot]"),
	);
	const track = panel.querySelector<HTMLElement>("[data-track]");
	const fill = panel.querySelector<HTMLElement>("[data-fill]");
	const handle = panel.querySelector<HTMLElement>("[data-handle]");
	const pointer = panel.querySelector<HTMLElement>("[data-pointer]");
	const pointerFill = panel.querySelector<SVGPathElement>(
		"[data-pointer-fill]",
	);
	const fields = panel.querySelectorAll<HTMLElement>("[data-field]");

	if (!dots.length) return;
	const lastIndex = dots.length - 1;

	// Stop positions (percent along the track) and the pointer notch colour at
	// each stop, both in dot order.
	const stops = dots.map((dot) => Number(dot.dataset.pos ?? 0));
	const colors = dots.map((dot) => dot.dataset.color ?? "");

	// Elements whose CSS transition is suspended while dragging so the bolt
	// tracks the pointer 1:1, then restored so the snap-back animates.
	const animated = [handle, fill, pointer].filter(
		(el): el is HTMLElement => el !== null,
	);

	/** Index of the stop nearest a given percent along the track. */
	function nearestIndex(pos: number): number {
		let best = 0;
		let bestDist = Infinity;
		stops.forEach((stop, i) => {
			const dist = Math.abs(stop - pos);
			if (dist < bestDist) {
				bestDist = dist;
				best = i;
			}
		});
		return best;
	}

	/** Move handle/fill/pointer to an arbitrary percent, without snapping. */
	function moveTo(pos: number): void {
		if (fill) fill.style.width = `${pos}%`;
		if (handle) handle.style.left = `${pos}%`;
		if (pointer) pointer.style.left = `${pos}%`;
	}

	/** Tint the pointer notch to match the panel gradient at the given stop. */
	function setPointerColor(index: number): void {
		if (pointerFill && colors[index]) {
			pointerFill.setAttribute("fill", colors[index]);
		}
	}

	/** Snap to a tier: update position, selected state, and value fields. */
	function select(index: number): void {
		const tier = tiers[index];
		if (!tier) return;

		dots.forEach((dot, i) =>
			dot.setAttribute("aria-checked", i === index ? "true" : "false"),
		);
		moveTo(stops[index]);
		setPointerColor(index);

		// Keep the slider handle's reported value in sync so screen readers
		// announce the current tier (aria-valuemin/max are static in the markup).
		if (handle) {
			handle.setAttribute("aria-valuenow", String(index));
			handle.setAttribute("aria-valuetext", tier.name);
		}

		fields.forEach((el) => {
			const key = el.dataset.field as keyof PricingTier | undefined;
			if (key && key in tier) el.textContent = tier[key];
		});
	}

	/** Move the keyboard focus/selection by `delta` stops, clamped. */
	function step(from: number, delta: number, focusDot = false): void {
		const to = clamp(from + delta, 0, lastIndex);
		if (focusDot) dots[to].focus();
		select(to);
	}

	// ── Dots: click to jump, arrow keys to move between them ───────────────
	dots.forEach((dot, i) => {
		dot.addEventListener("click", () => select(i));
		dot.addEventListener("keydown", (e) => {
			if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				e.preventDefault();
				step(i, 1, true);
			} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				e.preventDefault();
				step(i, -1, true);
			}
		});
	});

	// ── Bolt handle: drag to move, snap to nearest stop on release ─────────
	if (handle && track) {
		let dragging = false;

		/** Pointer clientX → percent (0–100) along the track, clamped. */
		const posFromClientX = (clientX: number): number => {
			const rect = track.getBoundingClientRect();
			if (rect.width === 0) return 0;
			return clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!dragging) return;
			e.preventDefault();
			const pos = posFromClientX(e.clientX);
			moveTo(pos);
			setPointerColor(nearestIndex(pos));
		};

		/** Tear down the active drag: restore transitions and drop listeners. */
		const stopDragging = (): void => {
			dragging = false;
			animated.forEach((el) => (el.style.transition = ""));
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerCancel);
		};

		const onPointerUp = (e: PointerEvent) => {
			if (!dragging) return;
			stopDragging();
			select(nearestIndex(posFromClientX(e.clientX)));
		};

		// The OS can cancel an in-progress touch drag (edge-swipe-back,
		// pull-to-refresh, multi-touch) — no pointerup follows, so clean up here
		// too and snap back from the handle's last position, or the drag would
		// stick and the handle would chase every later pointer move.
		const onPointerCancel = () => {
			if (!dragging) return;
			stopDragging();
			select(nearestIndex(parseFloat(handle.style.left) || 0));
		};

		handle.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			dragging = true;
			animated.forEach((el) => (el.style.transition = "none"));
			moveTo(posFromClientX(e.clientX));
			window.addEventListener("pointermove", onPointerMove);
			window.addEventListener("pointerup", onPointerUp);
			window.addEventListener("pointercancel", onPointerCancel);
		});

		handle.addEventListener("keydown", (e) => {
			const current = nearestIndex(parseFloat(handle.style.left) || 0);
			if (e.key === "ArrowRight" || e.key === "ArrowUp") {
				e.preventDefault();
				step(current, 1);
			} else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
				e.preventDefault();
				step(current, -1);
			}
		});
	}

	// The initial handle/fill/pointer position and field values are rendered
	// server-side (the Figma resting position), so there is no initial select()
	// here — the handle only snaps to a stop once the user picks one.
}

function initAnnualToggle(panel: HTMLElement): void {
	const toggle = panel.querySelector<HTMLButtonElement>(
		"[data-annual-toggle]",
	);
	const knob = panel.querySelector<HTMLElement>("[data-annual-knob]");
	if (!toggle || !knob) return;

	toggle.addEventListener("click", () => {
		const on = toggle.getAttribute("aria-checked") !== "true";
		toggle.setAttribute("aria-checked", on ? "true" : "false");
		knob.dataset.on = on ? "true" : "false";
	});
}

/** Wire up every pricing panel on the page. */
export function initPricingPlans(): void {
	document
		.querySelectorAll<HTMLElement>("[data-plan-panel]")
		.forEach((panel) => {
			initPlanStepper(panel);
			initAnnualToggle(panel);
		});
}
