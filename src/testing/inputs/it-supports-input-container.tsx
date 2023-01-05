import { cleanup, render } from "../solid";
import { Component, JSXElement } from "solid-js";

export function itSupportsInputContainer<P>(
  Component: Component<P>,
  requiredProps: P,
  name: string
) {
  it("supports inputContainer prop", () => {
    const { container } = render(() => (
      <Component
        {...requiredProps}
        required
        id="invalid-test-id"
        error
        inputContainer={(children: JSXElement) => (
          <div class="test-input-container">{children}</div>
        )}
      />
    ));

    expect(
      container.querySelector(".test-input-container")
    ).toBeInTheDocument();
    expect(
      container.querySelector(`.test-input-container .mantine-${name}-input`)
    ).toBeInTheDocument();
    cleanup();
  });
}
