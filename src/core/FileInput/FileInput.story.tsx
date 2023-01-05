import { createSignal } from "solid-js";
import { FileInput } from "./FileInput";

export default { title: "FileInput" };

export function Usage() {
  return (
    <div style={{ padding: "40px" }}>
      <FileInput
        label="Pick file"
        required
        placeholder="File input"
        clearable
      />
    </div>
  );
}

export function ReadOnly() {
  return (
    <div style={{ padding: "40px" }}>
      <FileInput
        label="Pick file"
        required
        placeholder="File input"
        clearable
        readOnly
      />
    </div>
  );
}

export function Controlled() {
  const [singleValue, setSingleValue] = createSignal<File | null>(null);
  const [multipleValue, setMultipleValue] = createSignal<File[]>([]);
  return (
    <div style={{ padding: "40px" }}>
      <FileInput
        value={singleValue}
        onChange={setSingleValue}
        placeholder="Controlled single"
        clearable
      />
      <FileInput
        mt="xl"
        multiple
        value={multipleValue}
        onChange={setMultipleValue}
        placeholder="Controlled multiple"
        clearable
      />
    </div>
  );
}
