import { Component } from "solid-js";
import { render } from "./solid";

export function itConnectsLabelAndInput<P>(
  Component: Component<P>,
  requiredProps: P
) {
  it("connects label and input with given id", () => {
    const { container } = render(() => (
      <Component {...requiredProps} id="secret-test-id" label="Test label" />
    ));
    expect(
      container.querySelector('[for="secret-test-id"]')
    ).toBeInTheDocument();
    expect(container.querySelector("#secret-test-id")).toBeInTheDocument();
  });
}
