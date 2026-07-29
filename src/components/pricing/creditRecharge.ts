/**
 * Client-side behavior for the Credit Recharge block (CreditRecharge.astro).
 *
 * One piece of state per panel — the selected plan — driving four readouts:
 * the plan badge, the recharge amount, the bonus percentage and the resulting
 * credit value. See the DOM hooks documented in CreditRecharge.astro.
 */

import { formatPrice } from "./pricingModel";

interface RechargeOption {
	id: string;
	name: string;
	recharge: number;
	bonusPct: number;
}

function initPanel(panel: HTMLElement): void {
	const options: RechargeOption[] = JSON.parse(panel.dataset.options ?? "[]");
	if (!options.length) return;

	const buttons = Array.from(
		panel.querySelectorAll<HTMLButtonElement>("[data-option]"),
	);

	/** Write a derived value into every element bound to `key`. */
	function setField(key: string, value: string): void {
		panel
			.querySelectorAll<HTMLElement>(`[data-field="${key}"]`)
			.forEach((el) => (el.textContent = value));
	}

	function select(index: number): void {
		const option = options[index];
		if (!option) return;

		buttons.forEach((button, i) =>
			button.setAttribute("aria-selected", i === index ? "true" : "false"),
		);

		setField("planName", option.name);
		setField("recharge", formatPrice(option.recharge));
		setField("bonusPct", `+${option.bonusPct}%`);
		setField(
			"creditsWorth",
			formatPrice(Math.round(option.recharge * (1 + option.bonusPct / 100))),
		);
	}

	buttons.forEach((button, i) => {
		button.addEventListener("click", () => select(i));
		button.addEventListener("keydown", (e) => {
			const delta =
				e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
			if (!delta) return;
			e.preventDefault();
			const to = Math.min(buttons.length - 1, Math.max(0, i + delta));
			buttons[to].focus();
			select(to);
		});
	});

	// First paint is rendered server-side from options[0], so no initial call.
}

/** Wire up every credit recharge panel on the page. */
export function initCreditRecharge(): void {
	document
		.querySelectorAll<HTMLElement>("[data-recharge-panel]")
		.forEach(initPanel);
}
