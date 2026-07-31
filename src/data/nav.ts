export interface NavLink {
	label: string;
	href: string;
}

export interface NavItem extends NavLink {
	/** Open in a new tab — for links that leave the site. */
	newTab?: boolean;
	/** Renders a ▾ dropdown with these links (no designed panel — see NOTES.md #3) */
	dropdown?: NavLink[];
	/** Small green badge rendered next to the label (e.g. "DotMe") */
	badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
	{ label: "Features", href: "/features" },
	{ label: "Pricing", href: "/pricing" },
	// "Resources" is hidden for now — its dropdown links have no destinations yet.
	// Restore this entry once those pages exist.
	// {
	// 	label: "Resources",
	// 	href: "#",
	// 	dropdown: [
	// 		{ label: "Product Demo", href: "#" },
	// 		{ label: "Blogs", href: "#" },
	// 		{ label: "FAQs", href: "#" },
	// 		{ label: "Contact Us", href: "#" },
	// 	],
	// },
	{
		label: "Linkin Bio",
		href: "https://www.dotme.in/",
		badge: "DotMe",
		newTab: true,
	},
];
