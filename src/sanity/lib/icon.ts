import type { Image } from "sanity";
import type { ImageMetadata } from "astro";
import { urlFor } from "./image";

/** The icon half of a Sanity card built with `iconFields()`. */
export interface SanityIcon {
	iconSource?: string;
	icon?: string;
	iconImage?: Image;
}

/**
 * Resolve a card's icon to a `src`, or undefined when it has neither a usable
 * upload nor a preset key the section knows. Callers treat undefined as "this
 * card isn't ready" and fall back to their local copy rather than render a
 * broken image.
 *
 * @param width CDN width for uploads — twice the box the icon draws at, for 2x DPR.
 */
export function resolveIcon(
	source: SanityIcon,
	presets: Record<string, ImageMetadata>,
	width: number,
): string | undefined {
	if (source.iconSource === "upload") {
		return source.iconImage?.asset ? urlFor(source.iconImage).width(width).url() : undefined;
	}
	return source.icon && source.icon in presets ? presets[source.icon].src : undefined;
}
