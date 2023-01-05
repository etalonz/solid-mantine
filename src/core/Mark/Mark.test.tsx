import { itRendersChildren, itSupportsSystemProps } from "testing";
import { Mark, MarkProps } from "./Mark";

const defaultProps: MarkProps = {
  children: "test-mark",
};

describe("@mantine/core/Mark", () => {
  itRendersChildren(Mark, defaultProps);
  itSupportsSystemProps({
    component: Mark,
    props: defaultProps,
    displayName: "@mantine/core/Mark",
    refType: HTMLElement,
    providerName: "Mark",
  });
});
