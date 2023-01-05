import { render, cleanup } from "./solid";
import { Component } from "solid-js";

export function itSupportsSx<P>(Component: Component<P>, requiredProps: P) {
  it("supports sx", async () => {
    const styles = { border: "1px solid aquamarine", background: "beige" };
    const fn = () => styles;

    const { container: withFunction } = render(() => (
      <Component {...requiredProps} sx={fn} />
    ));
    const { container: withObject } = render(() => (
      <Component {...requiredProps} sx={styles} />
    ));

    expect(withFunction.firstChild).toHaveStyle(styles);
    expect(withObject.firstChild).toHaveStyle(styles);
    cleanup();
  });
}
