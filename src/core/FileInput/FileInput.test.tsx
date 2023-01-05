import {
  checkAccessibility,
  itSupportsSystemProps,
  itSupportsFocusEvents,
  itSupportsInputProps,
} from "testing";
import { FileInput, FileInputProps } from "./FileInput";

const defaultProps: FileInputProps = {};

describe("@mantine/core/FileInput", () => {
  checkAccessibility([
    () => <FileInput placeholder="test-input" />,
    () => <FileInput aria-label="test-input" />,
  ]);
  itSupportsInputProps(FileInput, defaultProps, "FileInput");
  itSupportsFocusEvents(FileInput, defaultProps, "button");
  itSupportsSystemProps({
    component: FileInput,
    props: defaultProps,
    displayName: "@mantine/core/FileInput",
    refType: HTMLButtonElement,
    othersSelector: "button",
    providerName: "FileInput",
  });
});
