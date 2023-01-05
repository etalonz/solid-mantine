import { cleanup, render } from "../solid";
import { Component } from "solid-js";

export function itSupportsInputAsterisk<P>(
  Component: Component<P>,
  requiredProps: P,
  name: string
) {
  it("supports withAsterisk prop", () => {
    const { container } = render(() => (
      <Component
        {...requiredProps}
        required={false}
        withAsterisk
        label="test-label"
      />
    ));
    expect(
      container.querySelector(`.mantine-${name}-required`)
    ).toBeInTheDocument();
    cleanup();
  });
}
