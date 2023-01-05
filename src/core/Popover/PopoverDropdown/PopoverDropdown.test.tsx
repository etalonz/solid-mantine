import {
  createContextContainer,
  itSupportsSystemProps,
  itThrowsContextError,
  itRendersChildren,
  setupMatchMediaMock,
} from "testing";
import { PopoverDropdown, PopoverDropdownProps } from "./PopoverDropdown";
import { Popover } from "../Popover";
import { POPOVER_ERRORS } from "../Popover.errors";

const defaultProps: PopoverDropdownProps = {};

const TestContainer = createContextContainer(PopoverDropdown, Popover, {
  opened: true,
});

describe("@mantine/core/PopoverDropdown", () => {
  setupMatchMediaMock();

  itThrowsContextError(PopoverDropdown, defaultProps, POPOVER_ERRORS.context);
  itRendersChildren(TestContainer, defaultProps);

  itSupportsSystemProps({
    component: TestContainer,
    props: defaultProps,
    displayName: "@mantine/core/PopoverDropdown",
  });
});
