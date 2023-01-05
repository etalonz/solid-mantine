import { Button } from "../Button/Button";
import { Group } from "./Group";

const positions = (["left", "center", "apart", "right"] as const).map(
  (position) => (
    <div
      style={{
        padding: "15px",
        "background-color": "rgba(0, 0, 0, .1)",
        margin: "20px",
      }}
    >
      <Group position={position}>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </Group>
    </div>
  )
);

const spacings = ([0, "xs", "sm", "md", "lg", "xl", 50] as const).map(
  (spacing) => (
    <div
      style={{
        padding: "15px",
        "background-color": "rgba(0, 0, 0, .1)",
        margin: "20px",
      }}
    >
      <Group spacing={spacing}>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </Group>
    </div>
  )
);

export default { title: "Group" };

export const Positions = () => <>{positions}</>;
export const Spacing = () => <>{spacings}</>;
export const NoWrap = () => (
  <div
    style={{
      padding: "15px",
      "max-width": "200px",
      "background-color": "rgba(0, 0, 0, .1)",
    }}
  >
    <Group noWrap>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Group>
  </div>
);
export const Grow = () => (
  <div style={{ padding: "15px", "background-color": "rgba(0, 0, 0, .1)" }}>
    <Group grow>
      <Button>
        Button with so much content that it will try to take space from other
        elements
      </Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Group>
  </div>
);
export const InvalidChildren = () => (
  <Group>
    String
    {true}
    {20}
    <>Fragment</>
  </Group>
);
