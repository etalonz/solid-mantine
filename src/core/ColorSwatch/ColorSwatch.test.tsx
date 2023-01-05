import { itIsPolymorphic, itSupportsSystemProps } from "testing";
import { ColorSwatch, ColorSwatchProps } from "./ColorSwatch";

const defaultProps: ColorSwatchProps = {
  color: "#fff",
};

describe("@mantine/core/ColorSwatch", () => {
  itIsPolymorphic(ColorSwatch as any, defaultProps);
  itSupportsSystemProps({
    component: ColorSwatch,
    props: defaultProps,
    displayName: "@mantine/core/ColorSwatch",
    refType: HTMLDivElement,
    providerName: "ColorSwatch",
  });
});
