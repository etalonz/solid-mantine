import { Autocomplete } from "./Autocomplete";

export default { title: "Autocomplete" };

const data = ["React", "Angular", "Svelte", "Vue"];

export function Usage() {
  return (
    <div style={{ padding: "40px", "max-width": "400px" }}>
      <Autocomplete
        label="Autocomplete"
        placeholder="Autocomplete"
        data={data}
      />
    </div>
  );
}

export function ReadOnly() {
  return (
    <div style={{ padding: "40px", "max-width": "400px" }}>
      <Autocomplete
        label="Autocomplete"
        placeholder="Autocomplete"
        data={data}
        readOnly
      />
    </div>
  );
}
