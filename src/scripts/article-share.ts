/**
 * Copy-link button in ArticleShare.astro. The LinkedIn/X/Facebook buttons are
 * plain links and need no script — only the clipboard action does.
 */

function initArticleShare() {
	document.querySelectorAll<HTMLElement>("[data-share]").forEach((box) => {
		if (box.dataset.shareReady === "true") return;
		box.dataset.shareReady = "true";

		const button = box.querySelector<HTMLButtonElement>("[data-copy-link]");
		const status = box.querySelector<HTMLElement>("[data-copy-status]");
		if (!button) return;

		let hideTimer: number | undefined;

		button.addEventListener("click", async () => {
			const url = button.dataset.copyUrl;
			if (!url || !navigator.clipboard) return;

			try {
				await navigator.clipboard.writeText(url);
				if (status) {
					status.hidden = false;
					window.clearTimeout(hideTimer);
					hideTimer = window.setTimeout(() => {
						status.hidden = true;
					}, 2000);
				}
			} catch {
				// Permission denied or clipboard unavailable — the button just does nothing further.
			}
		});
	});
}

initArticleShare();
document.addEventListener("astro:page-load", initArticleShare);
