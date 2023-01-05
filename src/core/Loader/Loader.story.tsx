import { DEFAULT_THEME, MantineProvider } from "styles";
import { Loader, LoaderProps } from "./Loader";

const getThemes = (props?: LoaderProps) =>
  Object.keys(DEFAULT_THEME.colors).map((color) => (
    <Loader
      color={color}
      style={{ display: "block", "margin-top": "15px" }}
      {...props}
    />
  ));

const sizes = ([10, "xs", "sm", "md", "lg", "xl", 100] as const).map((size) => (
  <Loader size={size} style={{ display: "block", "margin-top": "15px" }} />
));

export default { title: "Loader" };

export const Oval = () => (
  <div style={{ padding: "15px" }}>{getThemes({ variant: "oval" })}</div>
);
export const Dots = () => (
  <div style={{ padding: "15px" }}>{getThemes({ variant: "dots" })}</div>
);
export const Bars = () => (
  <div style={{ padding: "15px" }}>{getThemes({ variant: "bars" })}</div>
);
export const Sizes = () => <div style={{ padding: "15px" }}>{sizes}</div>;
export const LoaderTypeOnMantineProvider = () => (
  <MantineProvider theme={{ loader: "dots" }}>
    <div style={{ padding: "15px" }}>
      <Loader />
    </div>
  </MantineProvider>
);
