export interface NavLink {
	label: string;
	href: string;
}

export interface NavItem extends Omit<NavLink, "href"> {
	/** Omitted on a dropdown parent, which renders as a button and never links. */
	href?: string;
	/** Open in a new tab — for links that leave the site. */
	newTab?: boolean;
	/** Renders a ▾ dropdown with these links. */
	dropdown?: NavLink[];
	/** Small green badge rendered next to the label (e.g. "DotMe") */
	badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
	{ label: "Features", href: "/features" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "Resources", href: "/blog" },
	{
		label: "Link-in Bio",
		href: "https://www.dotme.in/",
		badge: "DotMe",
		newTab: true,
	},
];
