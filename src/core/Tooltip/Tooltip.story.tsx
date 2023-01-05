import { Tooltip } from "./Tooltip";
import { Button } from "../Button";
import { Group } from "../Group";
import { createSignal } from "solid-js";

export default { title: "Tooltip" };

export function Usage() {
  return (
    <div style={{ padding: "40px" }}>
      <Tooltip position="right" label="Tooltip label" withArrow>
        <Button>target</Button>
      </Tooltip>
    </div>
  );
}

export const TooltipGroup = () => (
  <Tooltip.Group openDelay={500}>
    <Tooltip label="Tooltip 1">
      <button type="button">Button 1</button>
    </Tooltip>
    <Tooltip label="Tooltip 2">
      <button type="button">Button 2</button>
    </Tooltip>
    <Tooltip label="Tooltip 3">
      <button type="button">Button 3</button>
    </Tooltip>
  </Tooltip.Group>
);

export const Controlled = () => {
  const [opened, setOpened] = createSignal(false);
  return (
    <div style={{ padding: "40px" }}>
      <Tooltip label="Tooltip 1" opened={opened()}>
        <button
          type="button"
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
        >
          Hover to open both tooltips
        </button>
      </Tooltip>
      <Tooltip label="Tooltip 2" opened={opened()}>
        <button type="button">Button 2</button>
      </Tooltip>
    </div>
  );
};

export const Floating = () => (
  <div style={{ padding: 0 }}>
    <Tooltip.Floating label="Tooltip">
      <button type="button" style={{ width: "200px", height: "200px" }}>
        target
      </button>
    </Tooltip.Floating>
  </div>
);

export const Unmount = () => {
  const [mounted, setMounted] = createSignal(true);
  return (
    <div>
      <button type="button" onClick={() => setMounted((c) => !c)}>
        Toggle
      </button>
      <Tooltip opened label="Tooltip">
        <button
          type="button"
          style={{
            width: "200px",
            height: "200px",
            display: mounted() ? "block" : "none",
          }}
        >
          target
        </button>
      </Tooltip>
    </div>
  );
};

export const HexColor = () => (
  <Tooltip label="Tooltip 2" color="#F0F">
    <button type="button">Button 2</button>
  </Tooltip>
);

export const WithinGroup = () => (
  <Group grow>
    <Button>Regular button</Button>
    <Tooltip label="tooltip">
      <Button>Tooltip button</Button>
    </Tooltip>
  </Group>
);

export const WithArrow = () => (
  <Tooltip
    withArrow
    label="Tooltip button with arrow Tooltip button with arrow Tooltip button with arrow"
  >
    <Button type="button">Tooltip button with arrow</Button>
  </Tooltip>
);

export function Inline() {
  return (
    <div style={{ padding: "40px", "max-width": "400px" }}>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae ipsam in
      quos aperiam magni quas neque{" "}
      <Tooltip label="Inline tooltip" inline>
        <span style={{ background: "pink" }}>aliquid laboriosam dolorum</span>
      </Tooltip>
      , eum voluptate, perferendis placeat repudiandae nesciunt explicabo
      quibusdam deserunt, animi dicta.
    </div>
  );
}
