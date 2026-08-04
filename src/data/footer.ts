export interface FooterColumn {
	title: string;
	links: { label: string; href: string }[];
}

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

/**
 * Present as text layers in Figma but not visible in the rendered footer
 * (see NOTES.md #10). Append to FOOTER_COLUMNS to enable.
 */
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
