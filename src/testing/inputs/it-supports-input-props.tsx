import { Component } from "solid-js";
import { cleanup, render } from "../solid";
import { itConnectsLabelAndInput } from "../it-connects-label-and-input";
import { itSupportsInputIcon } from "./it-supports-input-icon";
import { itSupportsInputRightSection } from "./it-supports-input-right-section";
import { itSupportsInputWrapperProps } from "./it-supports-input-wrapper-props";
import { itSupportsInputStylesApi } from "./it-supports-input-styles-api";
import { itSupportsInputContainer } from "./it-supports-input-container";
import { itSupportsInputWrapperOrder } from "./it-supports-input-wrapper-order";
import { itSupportsInputAsterisk } from "./it-supports-input-asterisk";

export function itSupportsInputProps<P>(
  Component: Component<P>,
  requiredProps: P,
  name: string
) {
  itSupportsInputAsterisk(Component, requiredProps, name);
  itSupportsInputWrapperProps(Component, requiredProps, name);
  itSupportsInputContainer(Component, requiredProps, name);
  itSupportsInputWrapperOrder(Component, requiredProps, name);
  itConnectsLabelAndInput(Component, requiredProps);
  itSupportsInputStylesApi(Component, requiredProps);
  itSupportsInputIcon(Component, requiredProps);
  itSupportsInputRightSection(Component, requiredProps);

  it("handles error and invalid state", () => {
    const { container: invalid } = render(() => (
      <Component {...requiredProps} required id="invalid-test-id" error />
    ));
    const { container: withError } = render(() => (
      <Component
        {...requiredProps}
        required
        id="error-test-id"
        error="Test error"
      />
    ));

    expect(invalid.querySelector("#invalid-test-id")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(withError.querySelector("#error-test-id")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(invalid.querySelectorAll(`.mantine-${name}-error`)).toHaveLength(0);
    expect(
      withError.querySelector(`.mantine-${name}-error`)
    ).toBeInTheDocument();
    expect(withError.querySelector(`.mantine-${name}-error`).textContent).toBe(
      "Test error"
    );

    cleanup();
  });

  it("sets border-radius on input", () => {
    const { container } = render(() => (
      <Component {...requiredProps} radius={43} id="secret-test-id" />
    ));
    expect(container.querySelector("#secret-test-id")).toHaveStyle({
      borderRadius: "43px",
    });
    cleanup();
  });

  it("sets required attribute on input based on required prop", () => {
    const { container } = render(() => (
      <Component {...requiredProps} required id="secret-test-id" />
    ));

    expect(container.querySelector("#secret-test-id")).toHaveAttribute(
      "required"
    );

    cleanup();
  });
}
