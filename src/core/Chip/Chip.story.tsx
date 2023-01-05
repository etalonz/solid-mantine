import { createSignal } from "solid-js";
import { Chip } from "./Chip";

export default { title: "Chip" };

export function Usage() {
  return (
    <div style={{ padding: "40px" }}>
      <Chip type="radio">Single</Chip>
      <Chip disabled mt="xl">
        Disabled
      </Chip>
      <Chip disabled checked mt="xl">
        Disabled checked
      </Chip>
      <Chip type="checkbox" mt="xl">
        Multiple
      </Chip>
    </div>
  );
}

export function ChipGroup() {
  return (
    <div style={{ padding: "40px" }}>
      <Chip.Group defaultValue="react">
        <Chip value="react">React</Chip>
        <Chip value="ng">Angular</Chip>
      </Chip.Group>
    </div>
  );
}

export function ChipGroupControlled() {
  const [value, setValue] = createSignal("react");
  return (
    <div style={{ padding: "40px" }}>
      <Chip.Group multiple={false} value={value()} onChange={setValue}>
        <Chip value="react">React</Chip>
        <Chip value="ng">Angular</Chip>
      </Chip.Group>
      {value()}
    </div>
  );
}

export function ChipGroupMultiple() {
  return (
    <div style={{ padding: "40px" }}>
      <Chip.Group multiple defaultValue={["react"]}>
        <Chip value="react">React</Chip>
        <Chip value="ng">Angular</Chip>
      </Chip.Group>
    </div>
  );
}

export function ChipGroupMultipleControlled() {
  const [value, setValue] = createSignal(["react"]);
  return (
    <div style={{ padding: "40px" }}>
      <Chip.Group multiple value={value()} onChange={setValue}>
        <Chip value="react">React</Chip>
        <Chip value="ng">Angular</Chip>
      </Chip.Group>
      {value().toString()}
    </div>
  );
}
