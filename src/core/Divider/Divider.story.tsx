import { DEFAULT_THEME } from "styles";
import { Divider } from "./Divider";

const getColors = (props?: any) =>
  Object.keys(DEFAULT_THEME.colors).map((color) => (
    <Divider key={color} color={color} style={{ marginTop: 15 }} {...props} />
  ));

export default { title: "Divider" };

export const Colors = () => (
  <div style={{ padding: "20px" }}>{getColors()}</div>
);
export const Vertical = () => (
  <div style={{ padding: "20px", height: "200px" }}>
    <Divider orientation="vertical" />
  </div>
);
export const LabelProps = () => (
  <Divider
    labelPosition="center"
    label="test label"
    color="#000"
    size="xs"
    labelProps={{ color: "#000", size: "xl" }}
  />
);
