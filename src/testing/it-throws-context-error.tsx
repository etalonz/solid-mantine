import { Component } from "styles";
import { render, cleanup } from "testing";
import { patchConsoleError } from "./patch-console-error";

export function itThrowsContextError<P>(
  Component: Component<P>,
  requiredProps: P,
  errorMessage: string
) {
  it("throws error when rendered outside of context", async () => {
    patchConsoleError();
    expect(() => render(() => <Component {...requiredProps} />)).toThrow(
      new Error(errorMessage)
    );
    patchConsoleError.release();
    cleanup();
  });
}
