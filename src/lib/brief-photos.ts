import { urlFor } from "../sanity/lib/image";
import type { BriefSlotDoc } from "../sanity/lib/queries";

/** Uploaded photo URLs per brief id; a missing one keeps the bundled photo. */
export type BriefPhotos = Record<string, { main?: string; detail?: string }>;

/** Shared by the platform and ICP pages, whose brief slots carry the same two photo fields. */
export function resolveBriefPhotos(briefs: Record<string, BriefSlotDoc | undefined> | undefined): BriefPhotos {
	return Object.fromEntries(
		Object.entries(briefs ?? {}).map(([id, brief]) => [
			id,
			{
				// 2x the 478px main photo and the 245px small one.
				main: brief?.mainImage?.asset ? urlFor(brief.mainImage).width(956).url() : undefined,
				detail: brief?.detailImage?.asset ? urlFor(brief.detailImage).width(490).url() : undefined,
			},
		]),
	);
}
