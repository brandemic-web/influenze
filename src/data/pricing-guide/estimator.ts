/**
 * The estimator's sum and note, shared by the server render and scripts/credit-estimator.ts
 * so both print the same thing. Kept import-free so the client bundle stays tiny.
 * Note templates may use {credits}, {spare} and {over}.
 */
export const formatCredits = (n: number) => n.toLocaleString("en-IN");

export function estimatorNote(total: number, allowance: number, fits: string, over: string) {
	const vars: Record<string, number> = {
		credits: allowance,
		spare: Math.max(0, allowance - total),
		over: Math.max(0, total - allowance),
	};
	const template = total <= allowance ? fits : over;
	return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? formatCredits(vars[key]) : match));
}
