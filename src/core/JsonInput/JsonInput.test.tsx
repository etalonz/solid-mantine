import {
  itSupportsSystemProps,
  itSupportsInputProps,
  itSupportsFocusEvents,
  checkAccessibility,
} from "testing";
import { JsonInput, JsonInputProps } from "./JsonInput";

const defaultProps: JsonInputProps = {
  label: "test-label",
};

describe("@mantine/core/JsonInput", () => {
  checkAccessibility([() => <JsonInput {...defaultProps} />]);
  itSupportsFocusEvents(JsonInput, defaultProps, "textarea");
  itSupportsInputProps(JsonInput, defaultProps, "JsonInput");
  itSupportsSystemProps({
    component: JsonInput,
    props: defaultProps,
    displayName: "@mantine/core/JsonInput",
    refType: HTMLTextAreaElement,
    excludeOthers: true,
  });
});
