import type { APIRoute } from "astro";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

export const prerender = false;

export const GET: APIRoute = async () => {
	const expired = [`${perspectiveCookieName}=`, "Path=/", "Secure", "SameSite=None", "Max-Age=0"];

	// Clear both the partitioned and unpartitioned variants — browsers treat
	// them as separate cookies.
	const headers = new Headers();
	headers.append("Set-Cookie", expired.join("; "));
	headers.append("Set-Cookie", [...expired, "Partitioned"].join("; "));
	headers.set("Location", "/");

	return new Response(null, { status: 307, headers });
};
