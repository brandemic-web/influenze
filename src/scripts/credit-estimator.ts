/**
 * The pricing guide's credit estimator: each input's value × its `data-unit`, summed into
 * `[data-estimate-total]`, with the note switching on the signup allowance. The server
 * renders the default total, so this only takes over once someone types.
 */
function initEstimators() {
	document.querySelectorAll<HTMLElement>("[data-estimator]").forEach((root) => {
		if (root.dataset.estimatorReady === "true") return;
		const inputs = Array.from(root.querySelectorAll<HTMLInputElement>("input[data-unit]"));
		const total = root.querySelector<HTMLElement>("[data-estimate-total]");
		const note = root.querySelector<HTMLElement>("[data-estimate-note]");
		if (!inputs.length || !total || !note) return;
		root.dataset.estimatorReady = "true";

		const allowance = Number(root.dataset.allowance) || 0;
		const update = () => {
			const sum = inputs.reduce((acc, input) => {
				const count = Math.max(0, Math.floor(Number(input.value) || 0));
				return acc + count * Number(input.dataset.unit);
			}, 0);
			total.textContent = sum.toLocaleString("en-IN");
			note.textContent = (sum <= allowance ? root.dataset.fits : root.dataset.over) ?? "";
		};
		inputs.forEach((input) => input.addEventListener("input", update));
	});
}

initEstimators();
document.addEventListener("astro:page-load", initEstimators);
