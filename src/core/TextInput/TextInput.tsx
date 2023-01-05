import { ComponentProps, splitProps } from "solid-js";
import { DefaultProps, MantineSize, ComponentWithRef } from "styles";
import {
  Input,
  InputSharedProps,
  InputStylesNames,
  useInputProps,
  InputWrapperBaseProps,
  InputWrapperStylesNames,
} from "../Input";

export type TextInputStylesNames = InputStylesNames | InputWrapperStylesNames;

type HTMLInputTypeAttribute =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"
  | (string & {});

export interface TextInputProps
  extends DefaultProps<TextInputStylesNames>,
    InputSharedProps,
    InputWrapperBaseProps,
    Omit<ComponentProps<"input">, "size"> {
  /** Input element type */
  type?: HTMLInputTypeAttribute;

  /** Props passed to root element (InputWrapper component) */
  wrapperProps?: Record<string, any>;

  /** Input size */
  size?: MantineSize;

  __staticSelector?: string;
}

const defaultProps: Partial<TextInputProps> = {
  type: "text",
  size: "sm",
  __staticSelector: "TextInput",
};

export const TextInput: ComponentWithRef<TextInputProps, HTMLInputElement> = (
  props
) => {
  const [local, others] = splitProps(
    useInputProps("TextInput", defaultProps, props),
    ["inputProps", "wrapperProps"]
  );
  return (
    <Input.Wrapper {...local.wrapperProps}>
      <Input {...local.inputProps} {...others} />
    </Input.Wrapper>
  );
};

TextInput.displayName = "@mantine/core/TextInput";
