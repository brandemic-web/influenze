import type { StructureResolver } from "sanity/structure";

/**
 * siteSettings and pricingPage are singletons — one document each, edited in
 * place rather than listed/created/deleted like normal content. Every new
 * singleton page (home, features, …) gets one line here as it's added.
 */
const SINGLETONS = [
	{ id: "siteSettings", title: "Site Setting" },
	{ id: "homePage", title: "Home Page" },
	{ id: "pricingPage", title: "Pricing Page" },
	{ id: "featuresPage", title: "Features Page" },
	{ id: "blogIndex", title: "Blog Index" },
];

/** The six SEO templates and the competitors they share, kept in one folder. */
const LANDING_TYPES = [
	"comparisonPage",
	"alternativePage",
	"icpPage",
	"platformPage",
	"featurePage",
	"pricingGuide",
	"competitor",
];

const NOT_LISTED_LOOSE = new Set([...SINGLETONS.map((s) => s.id), ...LANDING_TYPES]);

export const structure: StructureResolver = (S) =>
	S.list()
		.title("Content")
		.items([
			...SINGLETONS.map(({ id, title }) =>
				S.listItem()
					.id(id)
					.title(title)
					.child(S.document().schemaType(id).documentId(id)),
			),
			S.divider(),
			S.listItem()
				.id("landingPages")
				.title("Landing Pages")
				.child(
					S.list()
						.title("Landing Pages")
						.items(LANDING_TYPES.map((type) => S.documentTypeListItem(type))),
				),
			S.divider(),
			...S.documentTypeListItems().filter(
				(item) => !NOT_LISTED_LOOSE.has(item.getId() ?? ""),
			),
		]);
