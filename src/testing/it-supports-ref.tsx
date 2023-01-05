import { render, cleanup } from "./solid";
import { Component } from "solid-js";

export function itSupportsRef<P>(
  Component: Component<P>,
  requiredProps: P,
  refType: any
) {
  it("supports getting ref with ref prop", () => {
    let ref: any = null;
    render(() => <Component {...requiredProps} ref={ref} />);
    expect(ref).toBeInstanceOf(refType);
    cleanup();
  });
}
