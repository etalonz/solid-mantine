import { cleanup, render, screen } from "./solid";
import userEvent from "@testing-library/user-event";
import { Component } from "solid-js";

export function itHandlesBooleanState<P>(
  Component: Component<P>,
  requiredProps: P
) {
  it("correctly handles uncontrolled state", async () => {
    render(() => <Component {...requiredProps} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).toBeChecked();

    cleanup();
  });

  it("correctly handles controlled state", async () => {
    const spy = vi.fn();
    render(() => (
      <Component {...requiredProps} checked={false} onChange={spy} />
    ));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    cleanup();
  });
}
