export interface FooterColumn {
	title: string;
	links: { label: string; href: string }[];
}

/**
 * `href: "#"` marks a page that does not exist yet — the source of the 8
 * `a11y-invalid-href` dev-toolbar findings per route. Swap in real URLs to clear.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
	{
		title: "Learn",
		links: [{ label: "Pricing", href: "/pricing" }, { label: "Features", href: "/features" }],
	},
	{
		title: "Resources",
		links: [
			{ label: "Product Demo", href: "#" },
			{ label: "Blogs", href: "#" },
			{ label: "FAQs", href: "#" },
			{ label: "Contact Us", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Terms Of Use", href: "#" },
			{ label: "Privacy Policy", href: "#" },
			{ label: "Report Violation", href: "#" },
			{ label: "CSAE Policy", href: "#" },
		],
	},
];

/** In Figma but not in the rendered design. Append to FOOTER_COLUMNS to enable. */
export const USE_CASES_COLUMN: FooterColumn = {
	title: "Use Cases",
	links: [
		{ label: "Influencer Marketing", href: "#" },
		{ label: "Talent Management", href: "#" },
		{ label: "Public Relations", href: "#" },
		{ label: "Advertising", href: "#" },
		{ label: "E-Commerce", href: "#" },
	],
};
