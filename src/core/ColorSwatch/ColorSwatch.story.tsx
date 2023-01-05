import { DEFAULT_THEME } from "styles";
import { Group } from "../Group/Group";
import { ColorSwatch } from "./ColorSwatch";

const swatches = Object.keys(DEFAULT_THEME.colors).map((theme) => (
  <ColorSwatch color={DEFAULT_THEME.colors[theme][5]} size={20} />
));

const transparent = Object.keys(DEFAULT_THEME.colors).map((theme) => (
  <ColorSwatch
    color={DEFAULT_THEME.fn.rgba(DEFAULT_THEME.colors[theme][5], 0.5)}
    size={20}
  />
));

export default { title: "ColorSwatch" };

export const Colors = () => (
  <Group style={{ padding: "15px" }}>{swatches}</Group>
);

export const OpaqueColors = () => (
  <Group style={{ padding: "15px" }}>{transparent}</Group>
);

export const CustomComponents = () => (
  <Group style={{ padding: "15px" }}>
    <ColorSwatch color="#f300f3" component="button" />
    <ColorSwatch color="#000" component="a" href="https://mantine.dev" />
  </Group>
);
