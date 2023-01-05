import { createSignal } from "solid-js";
import { ColorPicker } from "./ColorPicker";

export default { title: "ColorPicker" };

export function ColorSwatchesEvents() {
  const [value, setValue] = createSignal("#efefefe");
  return (
    <>
      <ColorPicker
        value={value()}
        onChange={setValue}
        swatches={["#eeeeee", "#d4d4d4", "#d4d5d6", "#5f3e4e"]}
      />
      Value: {value()}
    </>
  );
}
