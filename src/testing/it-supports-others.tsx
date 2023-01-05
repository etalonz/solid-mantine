import { render, cleanup } from "./solid";
import { Component } from "solid-js";

export function itSupportsOthers<P>(
  Component: Component<P>,
  requiredProps: P,
  selector?: string
) {
  it("supports ...others props", () => {
    const { container } = render(() => (
      <Component {...requiredProps} data-other-attribute="test" />
    ));
    const target = selector
      ? container.querySelector(selector)
      : container.firstChild;
    expect(target).toHaveAttribute("data-other-attribute", "test");
    cleanup();
  });
}
