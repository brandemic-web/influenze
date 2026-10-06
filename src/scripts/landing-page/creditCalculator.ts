/**
 * Live total for the credit calculator. The server renders the same sum for the default
 * inputs, so without JavaScript the panel is a worked example; with it, the inputs drive it.
 * Each input carries its own per-unit cost in `data-credits`, read off the markup.
 */
function initCreditCalculator() {
	for (const root of document.querySelectorAll<HTMLElement>("[data-credit-calc]")) {
		if (root.dataset.creditCalcReady === "true") continue;

		const inputs = Array.from(root.querySelectorAll<HTMLInputElement>("input[data-credits]"));
		const total = root.querySelector<HTMLElement>("[data-credit-total]");
		const fits = root.querySelector<HTMLElement>("[data-credit-fits]");
		const over = root.querySelector<HTMLElement>("[data-credit-over]");
		const starter = Number(root.dataset.starter);
		if (!inputs.length || !total || !fits || !over) continue;
		root.dataset.creditCalcReady = "true";

		const update = () => {
			const sum = inputs.reduce((acc, input) => {
				const count = Math.max(0, Math.floor(Number(input.value) || 0));
				return acc + count * Number(input.dataset.credits);
			}, 0);
			total.textContent = sum.toLocaleString("en-IN");
			fits.hidden = sum > starter;
			over.hidden = sum <= starter;
		};

		for (const input of inputs) {
			input.disabled = false;
			input.addEventListener("input", update);
		}
		update();
	}
}

initCreditCalculator();
document.addEventListener("astro:page-load", initCreditCalculator);
