import { itSupportsSystemProps, itRendersChildren } from "testing";
import { InputError, InputErrorProps } from "./InputError";

const defaultProps: InputErrorProps = {};

describe("@mantine/core/InputError", () => {
  itRendersChildren(InputError, defaultProps);
  itSupportsSystemProps({
    component: InputError,
    props: defaultProps,
    refType: HTMLDivElement,
    displayName: "@mantine/core/InputError",
  });
});
