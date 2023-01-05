import {
  checkAccessibility,
  itRendersChildren,
  itSupportsSystemProps,
  setupResizeObserverMock,
} from "testing";
import { Spoiler, SpoilerProps } from "./Spoiler";

const defaultProps: SpoilerProps = {
  maxHeight: 100,
  showLabel: "show",
  hideLabel: "hide",
  children: "test-children",
};

describe("@mantine/core/Spoiler", () => {
  setupResizeObserverMock();
  checkAccessibility([() => <Spoiler {...defaultProps} />]);
  itRendersChildren(Spoiler, defaultProps);
  itSupportsSystemProps({
    component: Spoiler,
    props: defaultProps,
    displayName: "@mantine/core/Spoiler",
    refType: HTMLDivElement,
    providerName: "Spoiler",
  });
});
