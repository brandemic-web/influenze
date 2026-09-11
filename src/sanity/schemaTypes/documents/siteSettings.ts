import { defineField, defineType } from "sanity";

/**
 * Singleton — one document holds site-wide identity, default SEO, and the
 * outbound URLs currently hardcoded in src/data/site.ts. The Studio's
 * structure builder pins this to a single non-deletable entry.
 */
export default defineType({
	name: "siteSettings",
	title: "Site Settings",
	type: "document",
	groups: [
		{ name: "general", title: "General", default: true },
		{ name: "navigation", title: "Navigation" },
		{ name: "footer", title: "Footer" },
		{ name: "redirects", title: "Redirects" },
		{ name: "crawlers", title: "AI & Search" },
	],
	fields: [
		defineField({
			name: "name",
			title: "Site name",
			type: "string",
			group: "general",
			description: 'Used as og:site_name and the Organization schema name, e.g. "influenze.ai".',
		}),
		defineField({
			name: "defaultTitle",
			title: "Default page title",
			type: "string",
			group: "general",
			description: "Used on any page that doesn't set its own SEO title.",
		}),
		defineField({
			name: "defaultDescription",
			title: "Default meta description",
			type: "text",
			rows: 3,
			group: "general",
		}),
		defineField({
			name: "defaultOgImage",
			title: "Default social share image",
			type: "image",
			options: { hotspot: true },
			group: "general",
		}),
		defineField({
			name: "signupUrl",
			title: "Sign up URL",
			type: "url",
			group: "general",
		}),
		defineField({
			name: "loginUrl",
			title: "Login URL",
			type: "url",
			group: "general",
		}),
		defineField({
			name: "customCode",
			title: "Custom Code",
			type: "customCode",
			group: "general",
			description: "Site-wide header/footer code, injected on every page in addition to any page-specific code below it.",
		}),
		defineField({
			name: "navItems",
			title: "Nav items",
			type: "array",
			group: "navigation",
			of: [{ type: "navItem" }],
			description:
				"The header nav, shown left to right in this order. Pre-filled with the site's current links — edit, reorder, hide, or add to change what visitors see without a deploy.",
			initialValue: [
				{ _key: "features", label: "Features", href: "/features" },
				{ _key: "pricing", label: "Pricing", href: "/pricing" },
				{ _key: "blog", label: "Blog", href: "/blog" },
				{
					_key: "link-in-bio",
					label: "Link-in Bio",
					href: "https://www.dotme.in/",
					badge: "DotMe",
					newTab: true,
				},
			],
		}),
		defineField({
			name: "footerColumns",
			title: "Footer columns",
			type: "array",
			group: "footer",
			of: [{ type: "footerColumn" }],
			description:
				"The footer's link columns, shown left to right (wraps on mobile). Pre-filled with the site's current links — edit, reorder, hide, or add to change what visitors see without a deploy.",
			initialValue: [
				{
					_key: "quick-links",
					title: "Quick Links",
					links: [
						{ _key: "pricing", label: "Pricing", href: "/pricing" },
						{ _key: "features", label: "Features", href: "/features" },
						{ _key: "blog", label: "Blog", href: "/blog" },
						{ _key: "dotme", label: "DotMe", href: "https://www.dotme.in/", newTab: true },
						{ _key: "contact", label: "Contact Us", href: "mailto:info@dotme.in" },
					],
				},
				{
					_key: "legal",
					title: "Legal",
					links: [
						{ _key: "terms", label: "Terms of Service", href: "/terms" },
						{ _key: "privacy", label: "Privacy Policy", href: "/privacy" },
					],
				},
			],
		}),
		defineField({
			name: "redirects",
			title: "Redirects",
			type: "array",
			group: "redirects",
			description: "Redirect a URL to a new destination — takes effect immediately, no deploy needed.",
			of: [
				{
					type: "object",
					name: "redirectRule",
					fields: [
						defineField({
							name: "source",
							title: "From path",
							type: "string",
							description: 'The path visitors currently hit, e.g. "/old-page". Must start with "/".',
							validation: (Rule) =>
								Rule.required().custom((value) =>
									!value || value.startsWith("/") ? true : 'Must start with "/"',
								),
						}),
						defineField({
							name: "destination",
							title: "Redirect to",
							type: "string",
							description: 'An internal path like "/new-page", or a full URL.',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "permanent",
							title: "Permanent (301)",
							type: "boolean",
							initialValue: true,
							description: "On = 301, permanent — search engines transfer ranking to the new URL. Off = 302, temporary.",
						}),
					],
					preview: {
						select: { source: "source", destination: "destination", permanent: "permanent" },
						prepare: ({ source, destination, permanent }) => ({
							title: `${source} → ${destination}`,
							subtitle: permanent === false ? "302 temporary" : "301 permanent",
						}),
					},
				},
			],
		}),
		defineField({
			name: "llmsTxt",
			title: "llms.txt",
			type: "text",
			rows: 16,
			group: "crawlers",
			description:
				"Served at influenze.ai/llms.txt — a plain-text/Markdown summary of the site for AI assistants and crawlers (ChatGPT, Claude, Perplexity, etc.) to read, so they cite the right pages. Written in the llms.txt convention: an H1 title, a one-line summary, then links to the key pages. Leave blank to serve the built-in default.",
			initialValue: `# influenze.ai

> Search 450M+ creators across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals.

influenze.ai is a creator discovery and campaign platform: targeted search and filtering, creator analytics and media kits, verified contact details, side-by-side comparisons, shareable shortlists, and fraud/authenticity signals.

## Pages

- [Home](https://influenze.ai/): overview of the platform
- [Features](https://influenze.ai/features): discovery, analytics, contact unlocks, comparisons, shortlists
- [Pricing](https://influenze.ai/pricing): credit-based plans and what's included
- [Blog](https://influenze.ai/blog): research, benchmarks and product notes on creator discovery, audience measurement and campaign design
- [Terms of Service](https://influenze.ai/terms)
- [Privacy Policy](https://influenze.ai/privacy)
`,
		}),
		defineField({
			name: "robotsTxt",
			title: "robots.txt",
			type: "text",
			rows: 20,
			group: "crawlers",
			description:
				"Served at influenze.ai/robots.txt. Leave blank to serve the built-in default (blocks AI training crawlers, allows search + AI-assistant crawlers, disallows /studio and /api/).",
			initialValue: `# Traditional search indexing.
User-agent: Googlebot
User-agent: Bingbot
Allow: /
Disallow: /studio
Disallow: /api/

# AI search and assistants. These cite the site and send real visitors, so they
# get the same access as Google. Note Applebot is here but Applebot-Extended is
# in the block below: the plain token is Apple's search crawler, the -Extended
# one is purely the training opt-out.
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: DuckAssistBot
User-agent: MistralAI-User
User-agent: Applebot
User-agent: FirecrawlAgent
User-agent: AndiBot
User-agent: ExaBot
User-agent: PhindBot
User-agent: YouBot
Allow: /
Disallow: /studio
Disallow: /api/

# Training crawlers — this content is not licensed for model training.
# Cloudflare's AI Crawl Control enforces this at the edge (per-crawler blocks,
# plus its managed robots.txt block prepended above this file), and covers a
# longer tail than the well-documented tokens named here. Stated in the repo too
# so the policy survives someone flipping a dashboard toggle.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: CCBot
User-agent: Google-Extended
User-agent: Google-CloudVertexBot
User-agent: Applebot-Extended
User-agent: Amazonbot
User-agent: Bytespider
User-agent: meta-externalagent
User-agent: PetalBot
Disallow: /

# Sanity Studio and the draft-mode endpoints are app surfaces, not content.
# Longest-match wins over the Allow, so these stay out of every index.
User-agent: *
Allow: /
Disallow: /studio
Disallow: /api/

Sitemap: https://influenze.ai/sitemap-index.xml
`,
		}),
	],
	preview: {
		prepare: () => ({ title: "Site Settings" }),
	},
});
