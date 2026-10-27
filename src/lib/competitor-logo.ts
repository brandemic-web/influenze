import type { Image } from "sanity";
import { urlFor } from "../sanity/lib/image";

export interface CompetitorLogo {
	src: string;
	w?: number;
	h?: number;
}

/** A page's optional competitor logo as a CDN URL plus its size, or undefined when none is uploaded. */
export function resolveCompetitorLogo(
	image: Image | undefined,
	size: { width?: number; height?: number } | undefined,
): CompetitorLogo | undefined {
	if (!image?.asset) return undefined;
	// 4x the 2.6875rem desktop height, so it stays sharp on large windows.
	return { src: urlFor(image).height(172).url(), w: size?.width, h: size?.height };
}
