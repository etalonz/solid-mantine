import userEvent from "@testing-library/user-event";
import {
  itRendersChildren,
  itSupportsRef,
  itSupportsSystemProps,
  render,
  screen,
  setupMatchMediaMock,
} from "testing";
import { Dialog, DialogBody, DialogProps } from "./Dialog";

const defaultProps: DialogProps = {
  opened: true,
  transitionDuration: 0,
  withCloseButton: true,
};

describe("@mantine/core/Dialog", () => {
  setupMatchMediaMock();

  itRendersChildren(DialogBody, defaultProps);
  itSupportsRef(Dialog, defaultProps, HTMLDivElement);
  itSupportsSystemProps({ component: DialogBody, props: defaultProps });

  it("calls onClose when close button is clicked", async () => {
    const spy = vi.fn();
    render(() => <DialogBody opened withCloseButton onClose={spy} />);
    await userEvent.click(screen.getByRole("button"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("has correct displayName", () => {
    expect(Dialog.displayName).toStrictEqual("@mantine/core/Dialog");
  });
});
