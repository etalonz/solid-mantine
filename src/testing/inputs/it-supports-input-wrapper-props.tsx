import { Component } from "solid-js";
import { screen, render, cleanup } from "../solid";
import { itSupportsWrapperProps } from "./it-supports-wrapper-props";

export function itSupportsInputWrapperProps<P>(
  Component: Component<P>,
  requiredProps: P,
  name: string
) {
  itSupportsWrapperProps(Component, requiredProps);

  it("handles required attribute correctly", () => {
    const { container } = render(() => (
      <Component
        {...requiredProps}
        required
        id="secret-test-id"
        label="Test label"
      />
    ));
    const requiredGlyph = container.querySelector(`.mantine-${name}-required`);
    expect(requiredGlyph).toBeInTheDocument();
    expect(requiredGlyph).toHaveAttribute("aria-hidden");

    cleanup();
  });

  it("supports description prop", () => {
    const { getByText } = render(() => (
      <Component {...requiredProps} description="Test description" />
    ));
    expect(getByText("Test description")).toBeInTheDocument();

    cleanup();
  });

  it("supports label prop", () => {
    const { getByText } = render(() => (
      <Component {...requiredProps} label="Test label" />
    ));
    expect(getByText("Test label")).toBeInTheDocument();

    cleanup();
  });

  it("supports error prop", () => {
    const { getByText } = render(() => (
      <Component {...requiredProps} error="Test error" />
    ));
    expect(getByText("Test error")).toBeInTheDocument();

    cleanup();
  });

  it("supports labelProps", () => {
    render(() => (
      <Component
        {...requiredProps}
        label="Test label"
        labelProps={{ "data-test": "test-data" }}
      />
    ));

    const label = screen.getByText("Test label");
    expect(label).toHaveAttribute("data-test", "test-data");

    cleanup();
  });

  it("supports errorProps", () => {
    render(() => (
      <Component
        {...requiredProps}
        error="Test error"
        errorProps={{ id: "test-error", "data-test": "test-data" }}
      />
    ));

    const error = screen.getByText("Test error");
    expect(error).toHaveAttribute("id", "test-error");
    expect(error).toHaveAttribute("data-test", "test-data");

    cleanup();
  });

  it("supports descriptionProps", () => {
    render(() => (
      <Component
        {...requiredProps}
        description="Test description"
        descriptionProps={{ id: "test-description", "data-test": "test-data" }}
      />
    ));

    const description = screen.getByText("Test description");
    expect(description).toHaveAttribute("id", "test-description");
    expect(description).toHaveAttribute("data-test", "test-data");

    cleanup();
  });
}
