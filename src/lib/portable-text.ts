/**
 * Shared @portabletext/to-html config: id-aware h2/h3 serializers (ids come
 * from lib/article-headings.ts's outline pass, keyed by block _key so the
 * rail and the rendered body can never disagree) and the in-body image
 * serializer. Used by lib/article-cta.ts to render each prose segment.
 */
import { toHTML, type PortableTextComponents } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "../sanity/lib/image";

export interface HeadingId {
	id: string;
	level: 2 | 3;
}

function escapeAttr(value: string): string {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderProseToHtml(
	blocks: PortableTextBlock[],
	headingIds: Map<string, HeadingId>,
): string {
	const heading =
		(style: "h2" | "h3") =>
		({ value, children }: { value: PortableTextBlock; children?: string }) => {
			const id = value._key ? headingIds.get(value._key)?.id : undefined;
			return `<${style}${id ? ` id="${id}"` : ""}>${children ?? ""}</${style}>`;
		};

	const components: PortableTextComponents = {
		block: {
			h2: heading("h2"),
			h3: heading("h3"),
		},
		types: {
			articleImage: ({ value }) => {
				const image = value as { image: unknown; alt?: string; caption?: string };
				const src = urlFor(image.image as Parameters<typeof urlFor>[0])
					.width(1200)
					.url();
				const alt = escapeAttr(image.alt ?? "");
				const caption = image.caption ? `<figcaption>${escapeAttr(image.caption)}</figcaption>` : "";
				return `<figure><img src="${src}" alt="${alt}" />${caption}</figure>`;
			},
			// Rendered separately by ArticleBody.astro as its own segment, never inline HTML.
			articleCta: () => "",
		},
	};

	return toHTML(blocks, { components });
}
