/**
 * Creator portraits, matched to rows by handle.
 *
 * Files live in src/assets/icons/workflow/profile_images and are named after the
 * creator's handle — `hyperfitx.avif` fills every avatar for `hyperfitx`. To add
 * a creator's photo, drop the file in under their handle; nothing here needs
 * touching. Anything without a match falls back to the gradient placeholder.
 */
import type { ImageMetadata } from "astro";
import { APP_USER, RESULT_CREATORS } from "./workflowMockup";

const PORTRAIT_DIR = "../assets/icons/workflow/profile_images";

const FILES = import.meta.glob<{ default: ImageMetadata }>(
	"../assets/icons/workflow/profile_images/*.{avif,webp,png,jpg,jpeg}",
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
	const handles = new Set([APP_USER.handle, ...RESULT_CREATORS.map((creator) => creator.handle)]);
	const missing = [...handles].filter((handle) => !BY_HANDLE.has(handle));
	// A file whose name matches no creator is almost always a typo in the name.
	const orphaned = [...BY_HANDLE.keys()].filter((handle) => !handles.has(handle));
	if (missing.length > 0) console.warn(`[creatorPortraits] no portrait for: ${missing.join(", ")}`);
	if (orphaned.length > 0) console.warn(`[creatorPortraits] no creator for: ${orphaned.join(", ")}`);
}
