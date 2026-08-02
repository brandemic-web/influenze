export interface Faq {
	question: string;
	answer: string;
}

export const FAQS: Faq[] = [
	{
		question: "Who is Influenze.ai for?",
		answer:
			"Influenze.ai is the starting point for anyone who runs creator campaigns. Influencer and gaming agencies, e-commerce brands, and talent managers. If creator research currently means a dozen browser tabs, a shared spreadsheet, and a lot of guesswork, Influenze replaces that with one place to discover, vet, shortlist, and contact creators.",
	},
	{
		question: "Which platforms and regions do you cover?",
		answer:
			"Creators across Instagram, YouTube, and TikTok, with 450M+ profiles across all platforms as we continue to scale.",
	},
	{
		question: "Is there a free trial?",
		answer:
			"Yes, one week, free. Full access to search, creator analytics, and lists so you can test it on a live brief before you commit.",
	},
	{
		question: "How accurate is your creator data?",
		answer:
			"Every profile is built from publicly available activity across Instagram, YouTube, and TikTok, then processed into audience, engagement, and performance signals. We run a daily audit process to catch anomalies like inflated follower counts and engagement pods, so what you see reflects real reach rather than vanity numbers.",
	},
	{
		question: "How fast can I build a shortlist?",
		answer:
			"Most searches produce a usable shortlist in minutes. Describe what you need in plain language, or filter by audience demographics, engagement quality, category, and location — then save the ones that fit into a list.",
	},
	{
		question: "How is Influenze different from an influencer marketing agency?",
		answer:
			"An agency runs campaigns for you. Influenze is the intelligence layer underneath — discovery, vetting, shortlisting, and contact details. Agencies are among our biggest users: they run their research on Influenze and spend their time on strategy and execution instead of tab-hopping. Brands running campaigns in-house use it the same way, minus the agency.",
	},
	{
		question: "How often is the data updated?",
		answer:
			"Profiles refresh on a rolling basis a couple of times a month. Creators with high posting activity and those viewed frequently update most often, while slower-moving attributes like location or category are revalidated on a longer cycle.",
	},
	{
		question: "Can I share shortlists with clients or teammates?",
		answer:
			"Yes. Lists can be shared as a clean, presentable view, so clients see the comparison without needing an account.",
	},
];

export const FAQ_HEADING = "Questions we get asked a lot";
export const FAQ_SUBCOPY = "Still have questions? Write to us at info@dotme.in";
