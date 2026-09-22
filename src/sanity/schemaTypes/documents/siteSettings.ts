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
	fieldsets: [
		{
			name: "identity",
			title: "Site identity & default SEO",
			options: { columns: 1 },
		},
		{
			name: "links",
			title: "Outbound links",
			options: { columns: 2 },
		},
		{
			name: "crawlers",
			title: "AI & Search",
		},
	],
	fields: [
		defineField({
			name: "name",
			title: "Site name",
			type: "string",
			description: 'Used as og:site_name and the Organization schema name, e.g. "influenze.ai".',
			fieldset: "identity",
		}),
		defineField({
			name: "defaultTitle",
			title: "Default page title",
			type: "string",
			description: "Used on any page that doesn't set its own SEO title.",
			fieldset: "identity",
		}),
		defineField({
			name: "defaultDescription",
			title: "Default meta description",
			type: "text",
			rows: 3,
			fieldset: "identity",
		}),
		defineField({
			name: "defaultOgImage",
			title: "Default social share image",
			type: "image",
			options: { hotspot: true },
			fieldset: "identity",
		}),
		defineField({
			name: "signupUrl",
			title: "Sign up URL",
			type: "url",
			fieldset: "links",
		}),
		defineField({
			name: "loginUrl",
			title: "Login URL",
			type: "url",
			fieldset: "links",
		}),
		defineField({
			name: "scripts",
			title: "Global scripts",
			description: "Injected into every page, before any per-page scripts.",
			type: "customScripts",
		}),
		defineField({
			name: "llmsTxt",
			title: "llms.txt",
			type: "text",
			rows: 16,
			fieldset: "crawlers",
			description:
				"Served at influenze.ai/llms.txt — a plain-text/Markdown summary of the site for AI assistants and crawlers (ChatGPT, Claude, Perplexity, etc.) to read, so they cite the right pages. Written in the llms.txt convention: an H1 title, a one-line summary, then links to the key pages. Leave blank to serve the built-in default.",
			initialValue: `# influenze.ai

> Search 450M+ creators across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals.

influenze.ai is a creator discovery and campaign platform: targeted search and filtering, creator analytics and media kits, verified contact details, side-by-side comparisons, shareable shortlists, and fraud/authenticity signals.

## Pages

- [Home](https://influenze.ai/): overview of the platform
- [Features](https://influenze.ai/features): discovery, analytics, contact unlocks, comparisons, shortlists
- [Pricing](https://influenze.ai/pricing): credit-based plans and what's included
- [Terms of Service](https://influenze.ai/terms)
- [Privacy Policy](https://influenze.ai/privacy)
`,
		}),
		defineField({
			name: "robotsTxt",
			title: "robots.txt",
			type: "text",
			rows: 20,
			fieldset: "crawlers",
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
	],
	preview: {
		prepare: () => ({ title: "Site Settings" }),
	},
});
