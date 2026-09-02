import type { StructureResolver } from "sanity/structure";

/**
 * siteSettings and pricingPage are singletons — one document each, edited in
 * place rather than listed/created/deleted like normal content. Every new
 * singleton page (home, features, …) gets one line here as it's added.
 */
const SINGLETONS = [
	{ id: "siteSettings", title: "Site Settings" },
	{ id: "homePage", title: "Home Page" },
	{ id: "pricingPage", title: "Pricing Page" },
	{ id: "featuresPage", title: "Features Page" },
];

const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.id));

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
			...S.documentTypeListItems().filter(
				(item) => !SINGLETON_TYPES.has(item.getId() ?? ""),
			),
		]);
