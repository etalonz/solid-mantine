import { useUncontrolled } from "hooks";
import { Component, DefaultProps, useComponentDefaultProps } from "styles";
import { validateJson } from "./validate-json/validate-json";
import { Textarea, TextareaProps } from "../Textarea";
import { TextInputStylesNames } from "../TextInput";
import useStyles from "./JsonInput.styles";
import { createSignal, JSXElement, splitProps } from "solid-js";

export type JsonInputStylesNames = TextInputStylesNames;

export interface JsonInputProps
  extends DefaultProps<JsonInputStylesNames>,
    Omit<TextareaProps, "onChange"> {
  /** Value for controlled input */
  value?: string;

  /** Default value for uncontrolled input */
  defaultValue?: string;

  /** onChange value for controlled input */
  onChange?(value: string): void;

  /** Format json on blur */
  formatOnBlur?: boolean;

  /** Error message shown when json is not valid */
  validationError?: JSXElement;
}

const defaultProps: Partial<JsonInputProps> = {
  formatOnBlur: false,
  size: "sm",
};

export const JsonInput: Component<JsonInputProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("JsonInput", defaultProps, props),
    [
      "value",
      "defaultValue",
      "onChange",
      "onFocus",
      "onBlur",
      "error",
      "formatOnBlur",
      "size",
      "validationError",
      "classNames",
      "unstyled",
      "readOnly",
    ]
  );

  const { classes, cx } = useStyles(
    { size: local.size },
    { name: "JsonInput", unstyled: local.unstyled }
  );
  const [_value, setValue] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: "",
    onChange: local.onChange,
  });

  const [valid, setValid] = createSignal(validateJson(_value()));

  const handleFocus = (event: FocusEvent) => {
    typeof local.onFocus === "function" && local.onFocus(event as any);
    setValid(true);
  };

  const handleBlur = (event: any) => {
    typeof local.onBlur === "function" && local.onBlur(event);
    const isValid = validateJson(event.currentTarget.value);
    local.formatOnBlur &&
      !local.readOnly &&
      isValid &&
      event.currentTarget.value.trim() !== "" &&
      setValue(JSON.stringify(JSON.parse(event.currentTarget.value), null, 2));
    setValid(isValid);
  };

  return (
    <Textarea
      value={_value()}
      onChange={(event) => setValue(event.currentTarget.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={valid() ? local.error : local.validationError || true}
      __staticSelector="JsonInput"
      classNames={{
        ...local.classNames,
        input: cx(classes.input, local.classNames?.input),
      }}
      autocomplete="nope"
      unstyled={local.unstyled}
      readOnly={local.readOnly}
      {...others}
    />
  );
};

JsonInput.displayName = "@mantine/core/JsonInput";
