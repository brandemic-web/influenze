import { defineField, defineType } from "sanity";

/**
 * Singleton — site-wide defaults: default OG image, global scripts,
 * navigation, footer, AI/search crawler files, and the sitemap override.
 * Pinned to one entry by the Studio's structure builder.
 */
export default defineType({
	name: "siteSettings",
	title: "Site Setting",
	type: "document",
	groups: [
		{ name: "general", title: "General", default: true },
		{ name: "navigation", title: "Navigation" },
		{ name: "footer", title: "Footer" },
		{ name: "crawlers", title: "AI & Search" },
		{ name: "sitemap", title: "Sitemap" },
	],
	fields: [
		defineField({
			name: "defaultOgImage",
			title: "Default social share image",
			type: "image",
			options: { hotspot: true },
			group: "general",
		}),
		defineField({
			name: "scripts",
			title: "Global scripts",
			description: "Injected into every page, before any per-page scripts.",
			type: "customScripts",
			group: "general",
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
				"Served at influenze.ai/robots.txt. Leave blank to serve the built-in default (blocks AI training crawlers, allows search + AI-assistant crawlers, disallows /studio, /api/ and /qc).",
			initialValue: `# Traditional search indexing.
User-agent: Googlebot
User-agent: Bingbot
Allow: /
Disallow: /studio
Disallow: /api/
Disallow: /qc

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
Disallow: /qc

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
Disallow: /qc

Sitemap: https://influenze.ai/sitemap-index.xml
`,
		}),
		defineField({
			name: "sitemapFile",
			title: "Custom sitemap.xml",
			type: "file",
			group: "sitemap",
			options: { accept: ".xml" },
			description:
				"Served at influenze.ai/sitemap.xml. Upload a sitemap to override the automatically generated one. Leave blank to keep serving the auto-generated sitemap (built from every page Astro renders).",
		}),
	],
	preview: {
		prepare: () => ({ title: "Site Setting" }),
	},
});
