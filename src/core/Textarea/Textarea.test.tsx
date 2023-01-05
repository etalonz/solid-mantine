import userEvent from "@testing-library/user-event";
import {
  checkAccessibility,
  itSupportsFocusEvents,
  itSupportsSystemProps,
  itSupportsInputProps,
  render,
  screen,
} from "testing";
import { Textarea, TextareaProps } from "./Textarea";

const defaultProps: TextareaProps = {};

describe("@mantine/core/Textarea", () => {
  itSupportsFocusEvents(Textarea, defaultProps, "textarea");
  itSupportsInputProps(Textarea, defaultProps, "Textarea");
  checkAccessibility([
    () => <Textarea label="test-label" />,
    () => <Textarea aria-label="test-label" />,
  ]);
  itSupportsSystemProps({
    component: Textarea,
    props: defaultProps,
    displayName: "@mantine/core/Textarea",
    refType: HTMLTextAreaElement,
    othersSelector: "textarea",
    providerName: "Textarea",
  });

  it("supports uncontrolled state", async () => {
    render(() => <Textarea {...defaultProps} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
    await userEvent.type(screen.getByRole("textbox"), "test-value");
    screen.getByRole("textbox").blur();
    expect(screen.getByRole("textbox")).toHaveValue("test-value");
  });

  it("supports controlled state", async () => {
    const spy = vi.fn();
    render(() => <Textarea {...defaultProps} value="" onChange={spy} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
    await userEvent.type(screen.getByRole("textbox"), "test-value");
    screen.getByRole("textbox").blur();
    expect(spy).toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
});
