/**
 * Shared shapes and company details for the two legal routes, `/terms` and
 * `/privacy`. The clause text itself lives in `terms.ts` and `privacy.ts`.
 *
 * PLACEHOLDER — the counsel-issued drafts leave five fields blank. The grievance
 * officer's phone number has since been supplied; the rest of the "blanks" block
 * below is still a stand-in chosen so the pages read correctly, and needs
 * confirming before these go live. See the note on each constant.
 */

export interface LegalContactRow {
	label: string;
	value: string;
	/** Turns the value into a link — `mailto:` for the email row. */
	href?: string;
}

export interface LegalClause {
	text: string;
	/** Lettered sub-points that hang off this clause. */
	items?: string[];
}

export interface LegalSection {
	/** Anchor target and table-of-contents link. */
	id: string;
	title: string;
	/** Rendered without a clause number — used only by the definitions block. */
	unnumbered?: boolean;
	/** Paragraphs above the numbered clauses, or the whole section when it has none. */
	intro?: string[];
	/** Numbered clauses; the renderer derives `n.m` from the section's position. */
	clauses?: LegalClause[];
	/** Unnumbered bullets — the two defined terms in the ToS. */
	bullets?: string[];
	/** Name/address/email/phone rows, rendered as a definition list. */
	contact?: LegalContactRow[];
}

export interface LegalDoc {
	/** Sits above the title in the hero. */
	eyebrow: string;
	title: string;
	description: string;
	updated: string;
	/** The "electronic record" line the ToS opens with. */
	notice?: string;
	preamble: string[];
	sections: LegalSection[];
}

// ── blanks left in the drafts ────────────────────────────────────────────────

/**
 * The drafts date from 18 August 2026 (per their filenames), which is what both
 * pages show as "Last updated". Re-date on the next counsel revision.
 */
export const LEGAL_UPDATED = "18 August 2026";

/**
 * Every `[---]` email blank in both drafts resolves here. `info@dotme.in` is the
 * address already published on the FAQ section, so it is known to receive mail —
 * but grievances and data-subject requests should get their own routed aliases
 * (grievance@ / privacy@) before launch, and this constant repointed at them.
 */
export const LEGAL_CONTACT_EMAIL = "info@dotme.in";

/** Registered office, taken from the body of both drafts. */
export const COMPANY_ADDRESS =
	"1612, Ground Floor, 7th Cross, 19th Main Road, 1st Sector, HSR Layout, Bengaluru, Karnataka – 560102";

/**
 * The grievance-officer block, identical in both documents. The drafts leave all
 * four rows blank; the name is still given by role rather than invented, but the
 * phone number the IT Rules require is now the real one, so the officer here is
 * reachable.
 */
export const GRIEVANCE_ROWS: LegalContactRow[] = [
	{ label: "Name", value: "Grievance Officer, Dotme Technologies Private Limited" },
	{ label: "Address", value: COMPANY_ADDRESS },
	{
		label: "Email",
		value: LEGAL_CONTACT_EMAIL,
		href: `mailto:${LEGAL_CONTACT_EMAIL}`,
	},
	{ label: "Mobile No.", value: "+91 72044 64330", href: "tel:+917204464330" },
];

/**
 * Splits a clause into plain runs and email addresses so the renderer can wrap
 * the latter in `mailto:` links. Done as a split rather than a replace because
 * the copy is set as text nodes, never as raw HTML.
 */
export function splitEmails(text: string): { value: string; email: boolean }[] {
	return text
		.split(/([\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,})/g)
		.filter(Boolean)
		.map((value) => ({ value, email: value.includes("@") }));
}
