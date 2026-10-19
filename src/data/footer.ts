import { LEGAL_PAGES } from "./legal";

export interface FooterColumn {
	title: string;
	links: {
		label: string;
		href: string;
		/** Open in a new tab — for links that leave the site. */
		newTab?: boolean;
	}[];
}

/**
 * Two columns: quick links, then the legal pages. Every href resolves — a real
 * route or the DotMe site — so nothing here is a placeholder.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
	{
		title: "Quick Links",
		links: [
			{ label: "Pricing", href: "/pricing/" },
			{ label: "Features", href: "/features/" },
			{ label: "Resources", href: "/blog/" },
			{ label: "DotMe", href: "https://www.dotme.in/", newTab: true },
			{ label: "Contact Us", href: "/contact/" },
		],
	},
	// "Resources" is hidden for now — its links have no destinations yet, matching
	// the dropdown commented out in nav.ts. Restore once those pages exist, along
	// with its MOBILE_PLACEMENT row in Footer.astro.
	// {
	// 	title: "Resources",
	// 	links: [
	// 		{ label: "Product Demo", href: "#" },
	// 		{ label: "Blogs", href: "#" },
	// 		{ label: "FAQs", href: "#" },
	// 		{ label: "Contact Us", href: "#" },
	// 	],
	// },
	{
		title: "Legal",
		// Contact Us already sits under Quick Links.
		links: LEGAL_PAGES.filter((page) => page.href !== "/contact/"),
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
