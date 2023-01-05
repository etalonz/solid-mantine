import { createSignal } from "solid-js";
import { DEFAULT_THEME, MANTINE_SIZES } from "styles";
import { ColorInput } from "./ColorInput";

export default { title: "ColorInput" };

export function Controlled() {
  const [value, setValue] = createSignal("rgba(84, 37, 186, 0.81)");
  return (
    <div style={{ margin: "auto", "max-width": "400px", "margin-top": "15px" }}>
      <ColorInput
        label="Controlled input"
        placeholder="Pick color"
        format="rgba"
        value={value()}
        onChange={setValue}
        swatches={[
          ...Object.keys(DEFAULT_THEME.colors).map(
            (color) => DEFAULT_THEME.colors[color][6]
          ),
          "rgba(0, 0, 0, 0)",
        ]}
        mb="md"
      />

      <button
        type="button"
        onClick={() => setValue("rgba(242, 165, 201, 0.54)")}
      >
        Set value
      </button>
      <button type="button" onClick={() => setValue("")}>
        Set empty
      </button>
    </div>
  );
}

export function Sizes() {
  const sizes = MANTINE_SIZES.map((size) => (
    <ColorInput
      size={size}
      label="Color input"
      placeholder="Pick color"
      format="rgba"
      style={{ "margin-top": "20px" }}
    />
  ));
  return <div style={{ padding: "40px" }}>{sizes}</div>;
}

/*export function Overlays() {
  return (
    <WithinOverlays>
      <ColorInput
        format="rgba"
        swatches={[
          ...Object.keys(DEFAULT_THEME.colors).map(
            (color) => DEFAULT_THEME.colors[color][6]
          ),
          "rgba(0, 0, 0, 0)",
        ]}
        label="Color"
        placeholder="Color"
        withinPortal={false}
      />
    </WithinOverlays>
  );
}*/

export function WithoutPickerAndSwatches() {
  return (
    <div style={{ padding: "40px", "max-width": "400px" }}>
      <ColorInput withPicker={false} swatches={[]} />
    </div>
  );
}

export function ReadOnly() {
  return (
    <div style={{ padding: "40px", "max-width": "400px" }}>
      <ColorInput label="Read only" placeholder="Read only" readOnly />
    </div>
  );
}
