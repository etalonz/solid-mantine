import { itSupportsSystemProps, checkAccessibility, render } from "testing";
import { TooltipFloating, TooltipFloatingProps } from "./TooltipFloating";

const defaultProps: TooltipFloatingProps = {
  withinPortal: false,
  label: "test-tooltip",
  children: <button type="button">test-target</button>,
};

describe("@mantine/core/Tooltip", () => {
  checkAccessibility([() => <TooltipFloating {...defaultProps} />]);
  itSupportsSystemProps({
    component: TooltipFloating,
    props: defaultProps,
    displayName: "@mantine/core/TooltipFloating",
    providerName: "TooltipFloating",
  });

  it("allows to get child ref", () => {
    let ref;
    render(() => (
      <TooltipFloating label="tooltip">
        <button type="button" ref={ref}>
          target
        </button>
      </TooltipFloating>
    ));
    expect(ref).toBeInstanceOf(HTMLButtonElement);
  });
});
