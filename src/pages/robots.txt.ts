import type { APIRoute } from "astro";
import { getSiteSettings } from "../sanity/lib/queries";

export const prerender = false;

// Same content as Site Settings > AI & Search > robots.txt's initialValue —
// kept here too so the route still serves something sensible before that
// document exists, or if the field is ever left blank.
const FALLBACK = `# Traditional search indexing.
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
`;

// No draft-mode wiring here — crawlers only ever see published content, same
// as llms.txt.
export const GET: APIRoute = async () => {
	const { data: siteSettings } = await getSiteSettings();
	const body = siteSettings?.robotsTxt?.trim() || FALLBACK;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
