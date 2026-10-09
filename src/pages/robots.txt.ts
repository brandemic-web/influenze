import type { APIRoute } from "astro";
import { getSiteSettings } from "../sanity/lib/queries";

export const prerender = false;

// Same content as Site Settings > AI & Search > robots.txt's initialValue —
// kept here too so the route still serves something sensible before that
// document exists, or if the field is ever left blank.
const FALLBACK = `User-agent: *

# Allow AI search and agent use
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: FirecrawlAgent
User-agent: AndiBot
User-agent: ExaBot
User-agent: PhindBot
User-agent: YouBot
User-agent: GPTBot
User-agent: CCBot
User-agent: Google-Extended
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: Google-CloudVertexBot
User-agent: Applebot-Extended
User-agent: Amazonbot
User-agent: Bytespider
User-agent: meta-externalagent
User-agent: PetalBot
Allow: /


# Allow traditional search indexing
User-agent: Googlebot
User-agent: Bingbot
Allow: /

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
