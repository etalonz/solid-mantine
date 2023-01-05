import { cleanup, render } from "../solid";
import { Component } from "solid-js";

export function itSupportsInputIcon<P>(
  Component: Component<P>,
  requiredProps: P
) {
  it("supports input icon", () => {
    const { getByText } = render(() => (
      <Component {...requiredProps} icon="Test icon" />
    ));
    expect(getByText("Test icon")).toBeInTheDocument();
    cleanup();
  });
}
