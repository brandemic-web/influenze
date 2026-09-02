import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "sanity:client";
import type { Image } from "sanity";

const builder = imageUrlBuilder(sanityClient);

/** Build a Sanity CDN URL for an image field, e.g. urlFor(seo.ogImage).width(1200).url() */
export function urlFor(source: Image) {
	return builder.image(source);
}
