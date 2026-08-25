import { useIsPresentationTool } from "@sanity/visual-editing/react";

/**
 * Floating "Exit draft mode" link, visible only when browsing the site
 * directly (in draft mode) rather than inside Studio's Presentation iframe,
 * which has its own controls for this. This is the whole point of the
 * cookie-based approach: no env flag to flip, just click this to leave.
 */
export default function DisableDraftMode() {
	const isPresentationTool = useIsPresentationTool();

	if (isPresentationTool !== false) return null;

	return (
		<a
			href="/api/draft-mode/disable"
			style={{
				position: "fixed",
				bottom: "1rem",
				right: "1rem",
				zIndex: 9999,
				padding: "0.5rem 0.85rem",
				borderRadius: "999px",
				background: "#000",
				color: "#fff",
				font: "500 13px/1 ui-sans-serif, system-ui, sans-serif",
				textDecoration: "none",
				boxShadow: "0 2px 12px rgb(0 0 0 / 0.25)",
			}}
		>
			Exit draft mode
		</a>
	);
}
