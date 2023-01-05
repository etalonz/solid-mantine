import { render, cleanup } from "./solid";
import { Component } from "solid-js";

export function itSupportsStyle<P>(Component: Component<P>, requiredProps: P) {
  it("supports style property", async () => {
    const { container } = render(() => (
      <Component {...requiredProps} style={{ border: "1px solid cyan" }} />
    ));
    expect(container.firstElementChild).toHaveStyle({
      border: "1px solid cyan",
    });
    cleanup();
  });
}
