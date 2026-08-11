import { DESKTOP_MIN } from "./breakpoints";

/**
 * "Show this in landscape" — a fullscreen, quarter-turned view of a live element.
 *
 * The workflow mockup needs 1440px of width to be readable, which a phone held
 * upright has nowhere near. Like a fullscreen video, this fills the screen and turns
 * the content a quarter turn; a media query drops the rotation if the reader does
 * rotate (see WorkflowMockup.astro).
 *
 * Markup contract, all matched on a shared id:
 *   [data-landscape-target="id"]  the element to show
 *   [data-landscape-open="id"]    button(s) that open it
 *   [data-landscape-host="id"]    the overlay, containing:
 *     [data-landscape-rotor]        the turned box the target is placed in
 *     [data-landscape-close]        button that closes it
 *
 * The target is *moved*, not cloned, so its animation keeps its state and listeners
 * — a clone would restart from static markup. That is safe because the pointer
 * resolves coordinates lazily and canvasScale refits off a ResizeObserver, so the
 * canvas re-scales to the overlay by itself. A placeholder holds its space in the
 * page, so nothing reflows and the scroll position survives.
 */

/** Fired on the target when it enters / leaves the landscape view. */
export const LANDSCAPE_OPEN = "landscape:open";
export const LANDSCAPE_CLOSE = "landscape:close";

/** `screen.orientation.lock` is not in the DOM lib — it is not universally supported. */
type LockableOrientation = ScreenOrientation & {
	lock?: (orientation: string) => Promise<void>;
	unlock?: () => void;
};

/*
 * Fullscreen, across the three shapes it ships in. iPad only has the `webkit` form,
 * and iPhone has no element fullscreen at all — nor does any Safari implement
 * `screen.orientation.lock`. So none of this is load-bearing; the CSS quarter turn
 * carries the feature alone. The prefixed calls return undefined, hence the wrapping.
 */
type FullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FullscreenDocument = Document & {
	webkitFullscreenElement?: Element | null;
	webkitExitFullscreen?: () => Promise<void> | void;
};

function requestFullscreen(element: HTMLElement) {
	const target = element as FullscreenElement;
	const request = target.requestFullscreen ?? target.webkitRequestFullscreen;
	if (!request) return Promise.reject(new Error("fullscreen unsupported"));

	// Called synchronously, not off a microtask: the request needs the click's
	// transient activation, and deferring it can lose that on some engines.
	try {
		return Promise.resolve(request.call(target));
	} catch (error) {
		return Promise.reject(error);
	}
}

function currentFullscreenElement() {
	const doc = document as FullscreenDocument;
	return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

function exitFullscreen() {
	const doc = document as FullscreenDocument;
	const exit = doc.exitFullscreen ?? doc.webkitExitFullscreen;
	if (!exit) return;
	try {
		Promise.resolve(exit.call(doc)).catch(() => {});
	} catch {
		/* Already out, or refused — nothing to undo. */
	}
}

function initLandscapeViewers() {
	document.querySelectorAll<HTMLElement>("[data-landscape-host]").forEach((host) => {
		if (host.dataset.landscapeReady === "true") return;

		const id = host.dataset.landscapeHost;
		const rotor = host.querySelector<HTMLElement>("[data-landscape-rotor]");
		const closer = host.querySelector<HTMLElement>("[data-landscape-close]");
		const target = document.querySelector<HTMLElement>(`[data-landscape-target="${id}"]`);
		const openers = document.querySelectorAll<HTMLElement>(`[data-landscape-open="${id}"]`);
		if (!rotor || !closer || !target || !openers.length) return;

		host.dataset.landscapeReady = "true";

		// `position: fixed` is relative to the viewport only while no ancestor has a
		// transform, filter or backdrop-filter. The hero has all three in places, so
		// the overlay is reparented to <body> where nothing can trap it. Astro's
		// scoped-style attribute travels with the element, so its CSS still applies.
		document.body.appendChild(host);

		const placeholder = document.createElement("div");
		placeholder.setAttribute("aria-hidden", "true");

		let isOpen = false;
		let wentFullscreen = false;
		let returnFocusTo: HTMLElement | null = null;

		function open() {
			if (isOpen) return;
			isOpen = true;
			returnFocusTo = document.activeElement as HTMLElement | null;

			// Measure before moving — once the target is in the overlay its old box is
			// gone, and the page would jump by the mockup's full height.
			placeholder.style.height = `${target!.getBoundingClientRect().height}px`;
			target!.parentNode?.insertBefore(placeholder, target!);
			rotor!.appendChild(target!);

			host.hidden = false;
			document.documentElement.style.overflow = "hidden";
			closer!.focus();
			target!.dispatchEvent(new CustomEvent(LANDSCAPE_OPEN));

			// Real fullscreen and a real orientation lock where they exist; the CSS
			// rotation already stands on its own, so both are enhancements.
			requestFullscreen(host)
				.then(() => {
					wentFullscreen = true;
					return (screen.orientation as LockableOrientation)?.lock?.("landscape");
				})
				.catch(() => {});
		}

		function close() {
			if (!isOpen) return;
			isOpen = false;

			(screen.orientation as LockableOrientation)?.unlock?.();
			if (wentFullscreen && currentFullscreenElement()) exitFullscreen();
			wentFullscreen = false;

			host.hidden = true;
			document.documentElement.style.overflow = "";
			// Back exactly where the placeholder is standing.
			placeholder.parentNode?.insertBefore(target!, placeholder);
			placeholder.remove();
			target!.dispatchEvent(new CustomEvent(LANDSCAPE_CLOSE));
			returnFocusTo?.focus();
		}

		openers.forEach((opener) => opener.addEventListener("click", open));
		closer.addEventListener("click", close);

		document.addEventListener("keydown", (event) => {
			if (isOpen && event.key === "Escape") close();
		});

		// Leaving fullscreen by a system gesture rather than the close button has to
		// bring the overlay down with it, or the target is stranded in a hidden host.
		// Guarded on `wentFullscreen`: where the request was refused there is no
		// fullscreen to leave, and this would fire on the way in.
		// Both spellings: Safari fires only the prefixed one below 16.4.
		const onFullscreenChange = () => {
			if (isOpen && wentFullscreen && !currentFullscreenElement()) close();
		};
		document.addEventListener("fullscreenchange", onFullscreenChange);
		document.addEventListener("webkitfullscreenchange", onFullscreenChange);

		// The opener is hidden from lg up, so a reader who reaches desktop width while
		// the overlay is up would be left with no way to dismiss it.
		window
			.matchMedia(`(min-width: ${DESKTOP_MIN}px)`)
			.addEventListener("change", (event) => {
				if (event.matches) close();
			});
	});
}

initLandscapeViewers();
// Re-init after Astro view transitions / client-side swaps.
document.addEventListener("astro:page-load", initLandscapeViewers);
