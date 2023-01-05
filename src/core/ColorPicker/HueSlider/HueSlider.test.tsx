import { checkAccessibility, itSupportsSystemProps } from "testing";
import { HueSlider, HueSliderProps } from "./HueSlider";

const defaultProps: HueSliderProps = {
  value: 150,
  onChange: () => {},
  onChangeEnd: () => {},
  size: "sm",
};

describe("@mantine/core/HueSlider", () => {
  checkAccessibility([
    () => <HueSlider {...defaultProps} aria-label="test-label" />,
  ]);
  itSupportsSystemProps({
    component: HueSlider,
    props: defaultProps,
    displayName: "@mantine/core/HueSlider",
    refType: HTMLDivElement,
  });
});
