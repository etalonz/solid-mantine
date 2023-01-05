import { Component } from "solid-js";
import { cleanup, render } from "../solid";

export function itSupportsWrapperProps<P>(
  Component: Component<P>,
  requiredProps: P
) {
  it("supports wrapperProps prop", () => {
    const { container } = render(() => (
      <Component
        {...requiredProps}
        wrapperProps={{ "data-test-prop": "test-prop" }}
      />
    ));
    expect(container.firstChild).toHaveAttribute("data-test-prop", "test-prop");

    cleanup();
  });
}
