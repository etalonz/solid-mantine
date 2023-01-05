import {
  checkAccessibility,
  itRendersChildren,
  itIsPolymorphic,
  itSupportsSystemProps,
  itSupportsFocusEvents,
  render,
  screen,
  cleanup,
} from "testing";
import { Button, ButtonProps } from "./Button";
import { ButtonGroup } from "./ButtonGroup/ButtonGroup";

const defaultProps: ButtonProps = {};

describe("@mantine/core/Button", () => {
  checkAccessibility([() => <Button>Mantine button</Button>]);
  itRendersChildren(Button, defaultProps);
  itIsPolymorphic(Button, defaultProps);
  itSupportsFocusEvents(Button, defaultProps, "button");
  itSupportsSystemProps({
    component: Button,
    props: defaultProps,
    displayName: "@mantine/core/Button",
    refType: HTMLButtonElement,
    providerName: "Button",
    excludePadding: true,
  });

  it("passes type to button component", () => {
    render(() => <Button type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    cleanup();
  });

  it("renders left and right icons if they are provided", () => {
    render(() => <Button rightIcon="right-icon" leftIcon="left-icon" />);
    expect(screen.getByText("right-icon")).toBeInTheDocument();
    expect(screen.getByText("left-icon")).toBeInTheDocument();
    cleanup();
  });

  it("sets disabled attribute based on prop", () => {
    render(() => <Button disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("data-disabled");
    cleanup();
  });

  it("sets data-loading attribute based on loading prop", () => {
    render(() => <Button loading />);
    expect(screen.getByRole("button")).toHaveAttribute("data-loading");
    cleanup();
  });

  it("exposes ButtonGroup as static component", () => {
    expect(Button.Group).toBe(ButtonGroup);
  });

  it("is disabled when inside fieldset disabled", () => {
    render(() => (
      <fieldset disabled>
        <Button type="submit" />
      </fieldset>
    ));
    expect(screen.getByRole("button")).toBeDisabled();
    cleanup();
  });
});
