import { itThrowsContextError } from "testing";
import { PopoverTarget } from "./PopoverTarget";
import { POPOVER_ERRORS } from "../Popover.errors";

describe("@mantine/core/PopoverTarget", () => {
  itThrowsContextError(
    () => (
      <PopoverTarget>
        <div>test</div>
      </PopoverTarget>
    ),
    {},
    POPOVER_ERRORS.context
  );

  it("has correct displayName", () => {
    expect(PopoverTarget.displayName).toEqual("@mantine/core/PopoverTarget");
  });
});
