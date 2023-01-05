import { Component } from "solid-js";
import { cleanup, render } from "../solid";

export function itSupportsInputRightSection<P>(
  Component: Component<P>,
  requiredProps: P
) {
  it("supports input right section", () => {
    const { getByText } = render(() => (
      <Component {...requiredProps} rightSection="Test right section" />
    ));
    expect(getByText("Test right section")).toBeInTheDocument();

    cleanup();
  });
}
