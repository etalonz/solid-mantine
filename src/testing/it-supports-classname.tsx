import { render, cleanup } from "./solid";
import { Component } from "solid-js";

export function itSupportsClassName<P>(
  Component: Component<P>,
  requiredProps: P
) {
  it("supports className prop", () => {
    const { container } = render(() => (
      <Component {...requiredProps} className="test-class-name" />
    ));
    expect(container.querySelector(".test-class-name")).toBeInTheDocument();
    cleanup();
  });
}
