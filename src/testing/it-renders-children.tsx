import { render, cleanup } from "./solid";
import { Component } from "solid-js";

export function itRendersChildren<P>(
  Component: Component<P>,
  requiredProps: P
) {
  it("renders children", () => {
    const { queryAllByText } = render(() => (
      <Component {...requiredProps}>
        <span class="test-children">test-children</span>
      </Component>
    ));
    expect(queryAllByText("test-children")).toHaveLength(1);
    cleanup();
  });
}
