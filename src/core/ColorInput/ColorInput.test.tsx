import {
  checkAccessibility,
  itSupportsSystemProps,
  itSupportsWrapperProps,
  itSupportsInputProps,
  setupMatchMediaMock,
} from "testing";
import { ColorInput, ColorInputProps } from "./ColorInput";

const defaultProps: ColorInputProps = {
  label: "test-label",
};

describe("@mantine/core/ColorInput", () => {
  setupMatchMediaMock();
  checkAccessibility([
    () => <ColorInput label="Color input" />,
    () => <ColorInput aria-label="Color input" />,
  ]);
  itSupportsWrapperProps(ColorInput, defaultProps);
  itSupportsInputProps(ColorInput, defaultProps, "ColorInput");
  itSupportsSystemProps({
    component: ColorInput,
    props: defaultProps,
    displayName: "@mantine/core/ColorInput",
    refType: HTMLInputElement,
    othersSelector: "input",
    providerName: "ColorInput",
  });
});
