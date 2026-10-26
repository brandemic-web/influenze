/**
 * The Product node the landing-page templates add to the site-wide JSON-LD graph
 * (Layout's `schema` prop), beside their FAQPage. It describes Influenze.ai itself:
 * the page's own description, the brand linked to the layout's Organization node, and
 * the plans' real price range as an AggregateOffer. No rating or review — there is no
 * genuine review data, and Google treats invented ratings as spam.
 */
import { getImage } from "astro:assets";
import logoSource from "../assets/images/common/logos_and_icons/influenze_wordmark_mobile.png";
import { PRICING_TIERS, SLIDER_MAX, SLIDER_MIN } from "../data/pricing";
import { SITE } from "../data/site";

export async function productSchema(site: URL, description: string) {
	// The same raster wordmark the Organization node uses.
	const image = await getImage({ src: logoSource, width: 600, format: "png" });
	return {
		"@type": "Product",
		"@id": new URL("/#product", site).href,
		name: SITE.name,
		description,
		image: new URL(image.src, site).href,
		brand: { "@id": new URL("/#organization", site).href },
		offers: {
			"@type": "AggregateOffer",
			priceCurrency: "INR",
			// Monthly spend, as the plans slider prices it: Starter's floor to Enterprise's.
			lowPrice: SLIDER_MIN,
			highPrice: SLIDER_MAX,
			offerCount: PRICING_TIERS.length,
			availability: "https://schema.org/InStock",
			url: new URL("/pricing/", site).href,
		},
	};
}
