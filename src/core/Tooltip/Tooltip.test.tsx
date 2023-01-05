import {
  itSupportsSystemProps,
  checkAccessibility,
  render,
  screen,
  setupMatchMediaMock,
  setupResizeObserverMock,
} from "testing";
import userEvent from "@testing-library/user-event";
import { Tooltip, TooltipProps } from "./Tooltip";
import { TooltipFloating } from "./TooltipFloating/TooltipFloating";
import { TooltipGroup } from "./TooltipGroup/TooltipGroup";
import { Box } from "../Box";

const defaultProps: Partial<TooltipProps> = {
  withinPortal: false,
  opened: true,
  transitionDuration: 0,
  label: "test-tooltip",
};

const TooltipWithTarget = (p) => (
  <Tooltip {...p}>
    <Box component="button" type="button">
      test-target
    </Box>
  </Tooltip>
);

describe("@mantine/core/Tooltip", () => {
  setupMatchMediaMock();
  setupResizeObserverMock();

  checkAccessibility([() => <TooltipWithTarget {...defaultProps} />]);
  itSupportsSystemProps({
    component: TooltipWithTarget,
    props: defaultProps,
    displayName: "@mantine/core/Tooltip",
    providerName: "Tooltip",
  });

  it("allows to get child ref", () => {
    let ref;
    render(() => (
      <Tooltip label="tooltip" opened>
        <Box component="button" type="button" ref={ref}>
          target
        </Box>
      </Tooltip>
    ));
    expect(ref).toBeInstanceOf(HTMLButtonElement);
  });

  it("shows tooltip when target element is hovered", async () => {
    render(() => (
      <Tooltip label="test-tooltip" transitionDuration={0}>
        <Box component="button" type="button">
          target
        </Box>
      </Tooltip>
    ));

    await userEvent.hover(screen.getByRole("button"));
    expect(screen.getByText("test-tooltip")).toBeInTheDocument();

    await userEvent.unhover(screen.getByRole("button"));
    expect(screen.queryAllByText("test-tooltip")).toHaveLength(0);
  });

  it("exposes TooltipGroup and TooltipFloating as static properties", () => {
    expect(Tooltip.Floating).toBe(TooltipFloating);
    expect(Tooltip.Group).toBe(TooltipGroup);
  });
});
