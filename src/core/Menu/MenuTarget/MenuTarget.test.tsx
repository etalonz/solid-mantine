import { itThrowsContextError } from "testing";
import { MenuTarget, MenuTargetProps } from "./MenuTarget";
import { MENU_ERRORS } from "../Menu.errors";

const defaultProps: MenuTargetProps = {
  children: (p) => <div {...p}>test</div>,
};

describe("@mantine/core/MenuTarget", () => {
  itThrowsContextError(MenuTarget, defaultProps, MENU_ERRORS.context);

  it("has correct displayName", () => {
    expect(MenuTarget.displayName).toEqual("@mantine/core/MenuTarget");
  });
});
