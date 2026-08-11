/**
 * Client-side behaviour for the pricing panel (PricingPlans.astro). One piece of state
 * per panel — the selected monthly spend, plus an annual flag — changed by dragging the
 * handle, clicking a tab or dot, or arrow keys. Everything visible is recomputed from it
 * by `render()`, using pricingModel.ts so first paint and drag agree.
 *
 * Entirely data-attribute driven: tier data arrives in `data-tiers` and the hooks are
 * documented in PricingPlans.astro.
 */

import type { PricingTier } from "../../data/pricing";
import {
	SPEND_STEP,
	clamp,
	spendFromPos,
	posFromSpend,
	isPastLastDot,
	tierIndexFromSpend,
	creditsFor,
	bonusLabel,
	formatPrice,
	formatAmount,
} from "./pricingModel";

function initPanel(panel: HTMLElement): void {
	const tiers: PricingTier[] = JSON.parse(panel.dataset.tiers ?? "[]");
	if (!tiers.length) return;

	const tabs = Array.from(panel.querySelectorAll<HTMLButtonElement>("[data-tab]"));
	const dots = Array.from(panel.querySelectorAll<HTMLButtonElement>("[data-dot]"));
	const track = panel.querySelector<HTMLElement>("[data-track]");
	const fill = panel.querySelector<HTMLElement>("[data-fill]");
	const handle = panel.querySelector<HTMLElement>("[data-handle]");
	const bodies = Array.from(panel.querySelectorAll<HTMLElement>("[data-panel]"));
	const annualToggle = panel.querySelector<HTMLButtonElement>(
		"[data-annual-toggle]",
	);
	const annualKnob = panel.querySelector<HTMLElement>("[data-annual-knob]");

	const min = tiers[0].minSpend;
	const max = tiers[tiers.length - 1].minSpend;

	let spend = Number(panel.dataset.defaultSpend ?? min);
	let annual = false;

	/**
	 * The handle's position is its own state, not something derived from `spend`.
	 * Past the last dot every position maps to the same top spend, so deriving it
	 * would snap the handle back to that dot the moment you let go — the whole
	 * stretch has to stay reachable.
	 */
	let pos = posFromSpend(spend, tiers);

	// Elements whose CSS transition is suspended while dragging so the bolt
	// tracks the pointer 1:1, then restored so the snap animates.
	const animated = [handle, fill].filter(
		(el): el is HTMLElement => el !== null,
	);

	/** Write a derived value into every element bound to `key`. */
	function setField(key: string, value: string): void {
		panel
			.querySelectorAll<HTMLElement>(`[data-field="${key}"]`)
			.forEach((el) => (el.textContent = value));
	}

	/** Repaint the whole panel from the current `pos` / `spend` / `annual` state. */
	function render(movePosition = true): void {
		const index = tierIndexFromSpend(spend, tiers);
		const tier = tiers[index];
		// Reaching a `custom` tier — Enterprise, from ₹1,00,000 up — means there is
		// no self-serve price to show, so the "talk to us" body takes the price
		// body's place. Keyed off the tier, not the handle position, so hitting the
		// last dot exactly (or clicking the Enterprise tab) already quotes. Matches
		// the server render, which hides the bodies on `initialTier.custom`.
		const quoting = tier.custom === true;

		if (movePosition) moveTo(pos);

		tabs.forEach((tab, i) =>
			tab.setAttribute("aria-selected", i === index ? "true" : "false"),
		);

		bodies.forEach((body) => {
			const wanted = quoting ? "custom" : "price";
			body.hidden = body.dataset.panel !== wanted;
		});

		setField("price", formatPrice(spend));
		setField("credits", formatAmount(creditsFor(spend, tier, annual)));
		setField("creditsBonus", bonusLabel(tier, annual));

		if (handle) {
			handle.setAttribute("aria-valuenow", String(spend));
			handle.setAttribute(
				"aria-valuetext",
				quoting
					? `${formatPrice(max)} or more per month — ${tier.name}, custom plan`
					: `${formatPrice(spend)} per month — ${tier.name}`,
			);
		}
	}

	/** Move handle/fill to an arbitrary percent, without changing `spend`. */
	function moveTo(pos: number): void {
		if (fill) fill.style.width = `${pos}%`;
		if (handle) handle.style.left = `${pos}%`;
	}

	/**
	 * Commit a position. Inside the priced range the position snaps to the
	 * stepped spend it represents; past the last dot it is kept as dropped.
	 */
	function setPos(next: number, movePosition = true): void {
		pos = clamp(next, 0, 100);
		spend = spendFromPos(pos, tiers);
		if (!isPastLastDot(pos)) pos = posFromSpend(spend, tiers);
		render(movePosition);
	}

	/** Commit a new spend value and repaint. */
	function setSpend(value: number, movePosition = true): void {
		spend = clamp(Math.round(value), min, max);
		pos = posFromSpend(spend, tiers);
		render(movePosition);
	}

	// ── Tabs and dots: jump to a tier's minimum spend ──────────────────────
	const selectTier = (i: number) => setSpend(tiers[i].minSpend);

	tabs.forEach((tab, i) => tab.addEventListener("click", () => selectTier(i)));
	dots.forEach((dot, i) => dot.addEventListener("click", () => selectTier(i)));

	// Left/Right arrows move between tabs, matching tablist conventions.
	tabs.forEach((tab, i) => {
		tab.addEventListener("keydown", (e) => {
			const delta =
				e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
			if (!delta) return;
			e.preventDefault();
			const to = clamp(i + delta, 0, tabs.length - 1);
			tabs[to].focus();
			selectTier(to);
		});
	});

	// ── Bolt handle: drag anywhere along the track ─────────────────────────
	if (handle && track) {
		let dragging = false;

		/** Pointer clientX → percent (0–100) along the track, clamped. */
		const posFromClientX = (clientX: number): number => {
			const rect = track.getBoundingClientRect();
			if (rect.width === 0) return 0;
			return clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
		};

		/**
		 * During a drag the handle follows the pointer exactly (so it never lags
		 * behind the finger) while the readouts update from the snapped spend —
		 * hence `movePosition = false`.
		 */
		const dragTo = (clientX: number): void => {
			const next = posFromClientX(clientX);
			moveTo(next);
			setPos(next, false);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!dragging) return;
			e.preventDefault();
			dragTo(e.clientX);
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
			// Settle the handle: inside the priced range it snaps to its stepped
			// spend, past the last dot it stays exactly where it was dropped.
			setPos(posFromClientX(e.clientX));
		};

		// The OS can cancel an in-progress touch drag (edge-swipe-back,
		// pull-to-refresh, multi-touch) — no pointerup follows, so clean up here
		// too and settle on whatever spend the drag last produced, or the drag
		// would stick and the handle would chase every later pointer move.
		const onPointerCancel = () => {
			if (!dragging) return;
			stopDragging();
			setSpend(spend);
		};

		handle.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			dragging = true;
			animated.forEach((el) => (el.style.transition = "none"));
			dragTo(e.clientX);
			window.addEventListener("pointermove", onPointerMove);
			window.addEventListener("pointerup", onPointerUp);
			window.addEventListener("pointercancel", onPointerCancel);
		});

		// Clicking the rail itself jumps the handle there, like a native range.
		track.addEventListener("pointerdown", (e) => {
			if (e.target !== track) return;
			setPos(posFromClientX(e.clientX));
		});

		handle.addEventListener("keydown", (e) => {
			const step =
				e.key === "ArrowRight" || e.key === "ArrowUp"
					? SPEND_STEP
					: e.key === "ArrowLeft" || e.key === "ArrowDown"
						? -SPEND_STEP
						: 0;
			if (!step) return;
			e.preventDefault();
			// Stepping back off the flat stretch lands on the last dot; stepping
			// again from there drops below it into the priced range.
			if (isPastLastDot(pos) && step < 0) setSpend(max);
			else setSpend(spend + step);
		});
	}

	// ── Annual billing switch: adds a credits bonus on top of the tier's ───
	if (annualToggle && annualKnob) {
		annualToggle.addEventListener("click", () => {
			annual = !annual;
			annualToggle.setAttribute("aria-checked", annual ? "true" : "false");
			annualKnob.dataset.on = annual ? "true" : "false";
			render();
		});
	}

	// The initial handle position and readouts are rendered server-side from
	// DEFAULT_SPEND via the same helpers, so no initial render() is needed.
}

/** Wire up every pricing panel on the page. */
export function initPricingPlans(): void {
	document
		.querySelectorAll<HTMLElement>("[data-plan-panel]")
		.forEach(initPanel);
}
