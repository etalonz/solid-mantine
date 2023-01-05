import { cleanup, fireEvent, render } from "./solid";
import { Component } from "solid-js";

export function itSupportsFocusEvents<P>(
  Component: Component<P>,
  requiredProps: P,
  selector?: string
) {
  it("supports focus events", () => {
    const onFocusSpy = vi.fn();
    const onBlurSpy = vi.fn();
    const { container } = render(() => (
      <Component {...requiredProps} onFocus={onFocusSpy} onBlur={onBlurSpy} />
    ));

    fireEvent.focus(container.querySelector(selector));
    expect(onFocusSpy).toHaveBeenCalled();

    fireEvent.blur(container.querySelector(selector));
    expect(onBlurSpy).toHaveBeenCalled();

    cleanup();
  });
}
