import gsap from "gsap";
import { typeText } from "../../../gsap/typeText";
import { swapInline } from "../utils/dom";
import type { Pointer } from "../utils/pointer";

/**
 * Beat 11 — type the address, Send (settles to "Sent"), close, then Analyze to land
 * back on screen 1 where the timeline loops. It must hand the mockup over in a state
 * beat 1 can start from — hence `reset`, and the cursor parked on the Analyze item.
 * 10 → 1 is a section change like beat 6's, so the nav pill snaps on the click.
 */

export interface RestartLayers {
	/** The share layer being left. */
	from: HTMLElement;
	/** Screen 1, where the story starts over. */
	to: HTMLElement;
	/**
	 * Beat 1's rail reset. It has to run *before* the card body fades in, not when the
	 * loop restarts, or the story comes home to a screen full of applied filters.
	 */
	reset?: () => void;
}

/** Every element the beat drives, or null if the markup is not what we expect. */
function collect({ from, to }: RestartLayers) {
	const field = from.querySelector<HTMLElement>("[data-wf-email-field]");

	const el = {
		field,
		hint: from.querySelector<HTMLElement>("[data-wf-email-hint]"),
		value: from.querySelector<HTMLElement>("[data-wf-email-value]"),
		caret: field?.querySelector<HTMLElement>("[data-wf-caret]") ?? null,
		send: from.querySelector<HTMLElement>("[data-wf-send]"),
		sendIdle: from.querySelector<HTMLElement>('[data-wf-send-label="idle"]'),
		sendDone: from.querySelector<HTMLElement>('[data-wf-send-label="done"]'),
		close: from.querySelector<HTMLElement>("[data-wf-share-close]"),
		panel: from.querySelector<HTMLElement>("[data-wf-panel-body]"),
		card: from.querySelector<HTMLElement>("[data-wf-share-card]"),
		// The nav inside the share layer's own backdrop copy of the list.
		navAnalyze: from.querySelector<HTMLElement>('[data-wf-nav="analyze"]'),
		fromBody: from.querySelector<HTMLElement>("[data-wf-card-body]"),
		toBody: to.querySelector<HTMLElement>("[data-wf-card-body]"),
	};

	return Object.values(el).every(Boolean) ? (el as { [K in keyof typeof el]: NonNullable<(typeof el)[K]> }) : null;
}

export function restart(layers: RestartLayers, pointer: Pointer) {
	const el = collect(layers);
	if (!el) return null;

	// Read from the markup before the timeline runs, so a loop can't retype its output.
	const address = el.value.textContent?.trim() ?? "";

	const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

	// Wind the share form back to blank, so the loop plays it again from the start.
	tl.call(() => {
		layers.to.removeAttribute("data-wf-active");
		layers.from.setAttribute("data-wf-active", "");
	})
		.set(el.hint, { display: "inline", opacity: 1 })
		.set(el.value, { display: "none" })
		.set(el.caret, { display: "none" })
		.set(el.sendIdle, { display: "inline", opacity: 1 })
		.set(el.sendDone, { display: "none" });

	// ── type the address ─────────────────────────────────────────────────────
	tl.add(pointer.moveTo(el.field, { at: { x: 0.22 }, duration: 0.7 }))
		.add(pointer.press())
		.call(() => {
			gsap.set(el.hint, { display: "none" });
			el.value.textContent = "";
			gsap.set(el.value, { display: "inline", opacity: 1 });
			// Inline context here, unlike beat 1's carets, which sit in flex rows.
			gsap.set(el.caret, { display: "inline-block" });
		})
		.add(typeText(el.value, address))
		.call(() => gsap.set(el.caret, { display: "none" }), undefined, "+=0.25");

	// ── send it ──────────────────────────────────────────────────────────────
	tl.add(pointer.moveTo(el.send, { duration: 0.6 }), "+=0.3")
		.add(pointer.press())
		.add(swapInline(el.sendIdle, el.sendDone), "-=0.05");

	// ── close the modal ──────────────────────────────────────────────────────
	// 200ms out on the blur, against 260ms in — the app's own asymmetry.
	tl.add(pointer.moveTo(el.close, { duration: 0.6 }), "+=0.45")
		.add(pointer.press())
		.addLabel("close")
		.to(el.card, { opacity: 0, duration: 0.22 }, "close")
		.to(el.panel, { filter: "blur(0px)", duration: 0.2, ease: "none" }, "close+=0.04");

	// ── home, and round again ────────────────────────────────────────────────
	const LEAVE = 0.3;
	tl.add(pointer.moveTo(el.navAnalyze, { duration: 0.8 }), "+=0.4")
		.add(pointer.press())
		.addLabel("go")
		.to(el.fromBody, { opacity: 0, duration: LEAVE }, "go");

	tl.addLabel("swap", `go+=${LEAVE}`)
		.call(
			() => {
				// Clean the rail while screen 1 is still hidden.
				layers.reset?.();
				layers.from.removeAttribute("data-wf-active");
				layers.to.setAttribute("data-wf-active", "");
			},
			undefined,
			"swap"
		)
		// Leave the layer we came from as we found it, so the next loop starts clean.
		.set(el.fromBody, { opacity: 1 }, "swap")
		.from(el.toBody, { opacity: 0, duration: 0.4, immediateRender: false }, "swap");

	// The cursor stays put and visible — it ends where beat 1 parks it, so the loop
	// seam needs no fade.
	return tl;
}
