import { Checkbox, Text } from "@sanity/ui";
import { set, unset, type ArrayOfPrimitivesInputProps } from "sanity";
import { BUBBLE_LABELS, BUBBLE_NAMES } from "../../data/feature/shared";

/**
 * Studio input for "Hero creator bubbles": the 12 creator_bubble files as a two-column
 * checkbox grid. Sanity's own list layouts are one column or a fixed four, which cuts the
 * file names off. It stores the same array of names (`["one", "five", …]`) as the default
 * checkbox list, so the page code and saved documents don't change.
 */
export function BubblePicker(props: ArrayOfPrimitivesInputProps) {
	const { onChange, readOnly } = props;
	const value = (props.value ?? []) as string[];

	const toggle = (name: string, on: boolean) => {
		const next = on ? [...value, name] : value.filter((v) => v !== name);
		onChange(next.length ? set(next) : unset());
	};

	return (
		<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem 1rem", padding: "0.5rem 0" }}>
			{BUBBLE_NAMES.map((name) => (
				<label
					key={name}
					style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: readOnly ? "default" : "pointer" }}
				>
					<Checkbox checked={value.includes(name)} disabled={readOnly} onChange={(e) => toggle(name, e.currentTarget.checked)} />
					<Text size={1}>{BUBBLE_LABELS[name]}</Text>
				</label>
			))}
		</div>
	);
}
