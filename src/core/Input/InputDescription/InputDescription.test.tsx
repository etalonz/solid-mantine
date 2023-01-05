import { itSupportsSystemProps, itRendersChildren } from "testing";
import { InputDescription, InputDescriptionProps } from "./InputDescription";

const defaultProps: InputDescriptionProps = {};

describe("@mantine/core/InputDescription", () => {
  itRendersChildren(InputDescription, defaultProps);
  itSupportsSystemProps({
    component: InputDescription,
    props: defaultProps,
    refType: HTMLDivElement,
    displayName: "@mantine/core/InputDescription",
  });
});
