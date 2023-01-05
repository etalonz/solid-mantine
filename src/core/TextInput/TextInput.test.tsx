import {
  render,
  screen,
  checkAccessibility,
  itSupportsSystemProps,
  itSupportsFocusEvents,
  itSupportsInputProps,
  cleanup,
  fireEvent,
} from "testing";
import userEvent from "@testing-library/user-event";
import { TextInput, TextInputProps } from "./TextInput";

const defaultProps: TextInputProps = {};

describe("@mantine/core/TextInput", () => {
  checkAccessibility([
    () => <TextInput label="test-input" />,
    () => <TextInput aria-label="test-input" />,
  ]);
  itSupportsInputProps(TextInput, defaultProps, "TextInput");
  itSupportsFocusEvents(TextInput, defaultProps, "input");
  itSupportsSystemProps({
    component: TextInput,
    props: defaultProps,
    displayName: "@mantine/core/TextInput",
    refType: HTMLInputElement,
    othersSelector: "input",
    providerName: "TextInput",
  });

  it("supports uncontrolled state", async () => {
    render(() => <TextInput {...defaultProps} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
    await userEvent.type(screen.getByRole("textbox"), "test-value");
    expect(screen.getByRole("textbox")).toHaveValue("test-value");
    cleanup();
  });

  it("supports controlled state", async () => {
    const spy = vi.fn();
    render(() => <TextInput {...defaultProps} value="" onChange={spy} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
    await userEvent.type(screen.getByRole("textbox"), "test-value");
    // In solid, onChange is only called on blur
    fireEvent.blur(screen.getByRole("textbox"));
    expect(spy).toHaveBeenCalled();
    // solid doesn't rerender with onChange so it will hold the entered value
    expect(screen.getByRole("textbox")).toHaveValue("test-value");
  });
});
