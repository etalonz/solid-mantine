import { itThrowsContextError } from "testing";
import { HoverCardTarget, HoverCardTargetProps } from "./HoverCardTarget";
import { HOVER_CARD_ERRORS } from "../HoverCard.errors";

const defaultProps: HoverCardTargetProps = {
  children: () => <div>test</div>,
};

describe("@mantine/core/HoverCardTarget", () => {
  itThrowsContextError(
    HoverCardTarget,
    defaultProps,
    HOVER_CARD_ERRORS.context
  );

  it("has correct displayName", () => {
    expect(HoverCardTarget.displayName).toEqual(
      "@mantine/core/HoverCardTarget"
    );
  });
});
