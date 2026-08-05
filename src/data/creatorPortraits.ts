/**
 * Creator portraits, matched to rows by handle.
 *
 * Files live in src/assets/images/workflow/profile_images and are named after the
 * creator's handle — `hyperfitx.avif` fills every avatar for `hyperfitx`. To add
 * a creator's photo, drop the file in under their handle; nothing here needs
 * touching. Anything without a match falls back to the gradient placeholder.
 */
import type { ImageMetadata } from "astro";
import { APP_USER, RESULT_CREATORS, SHOWCASE_HANDLES } from "./workflowMockup";

const PORTRAIT_DIR = "../assets/images/workflow/profile_images";

const FILES = import.meta.glob<{ default: ImageMetadata }>(
	"../assets/images/workflow/profile_images/*.{avif,webp,png,jpg,jpeg}",
	{ eager: true },
);

const BY_HANDLE = new Map<string, ImageMetadata>(
	Object.entries(FILES).map(([path, module]) => [
		path.slice(PORTRAIT_DIR.length + 1).replace(/\.\w+$/, ""),
		module.default,
	]),
);

/** That creator's portrait, or undefined if we have not been given one yet. */
export const portraitFor = (handle: string): ImageMetadata | undefined => BY_HANDLE.get(handle);

if (import.meta.env.DEV) {
	// The signed-in user has a portrait here too, and is not one of the creators.
	// The features page's showcase cast is separate from the story's, so it counts.
	const handles = new Set([
		APP_USER.handle,
		...RESULT_CREATORS.map((creator) => creator.handle),
		...SHOWCASE_HANDLES,
	]);
	const missing = [...handles].filter((handle) => !BY_HANDLE.has(handle));
	if (missing.length > 0) console.warn(`[creatorPortraits] no portrait for: ${missing.join(", ")}`);
	// No orphan check: the CreatorsAI collage's list cards draw a handful of extra
	// faces of their own, so a file matching no creator here is expected.
}
