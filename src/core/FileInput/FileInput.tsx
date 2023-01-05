import { ComponentWithRef, DefaultProps, MantineSize, Selectors } from "styles";
import { useUncontrolled } from "hooks";
import {
  Input,
  InputSharedProps,
  InputStylesNames,
  useInputProps,
  InputWrapperBaseProps,
  InputWrapperStylesNames,
} from "../Input";
import { CloseButton } from "../CloseButton";
import { FileButton } from "../FileButton";
import useStyles from "./FileInput.styles";
import {
  Accessor,
  Component,
  ComponentProps,
  createEffect,
  createMemo,
  JSXElement,
  splitProps,
} from "solid-js";

export type FileInputStylesNames =
  | InputStylesNames
  | InputWrapperStylesNames
  | Selectors<typeof useStyles>;

export interface FileInputProps<Multiple extends boolean = false>
  extends DefaultProps<FileInputStylesNames>,
    InputSharedProps,
    InputWrapperBaseProps,
    Omit<
      ComponentProps<"button">,
      "size" | "onChange" | "value" | "defaultValue"
    > {
  /** Props passed to root element (InputWrapper component) */
  wrapperProps?: Record<string, any>;

  /** Called when user picks files */
  onChange?(payload: Multiple extends true ? File[] : File | null): void;

  /** Controlled input value */
  value?: Multiple extends true ? Accessor<File[]> : Accessor<File | null>;

  /** Uncontrolled input default value */
  defaultValue?: Multiple extends true ? File[] : File | null;

  /** Input size */
  size?: MantineSize;

  /** Determines whether user can pick more than one file */
  multiple?: Multiple;

  /** File input accept attribute, for example, "image/png,image/jpeg" */
  accept?: string;

  /** Input name attribute */
  name?: string;

  /** Input form attribute */
  form?: string;

  /** Current value renderer */
  valueComponent?: Component<{ value: null | File | File[] }>;

  /** Allow to clear value */
  clearable?: boolean;

  /** aria-label for clear button */
  clearButtonLabel?: string;

  /** Set the clear button tab index to disabled or default after input field */
  clearButtonTabIndex?: -1 | 0;

  /** Determines whether the user can change value */
  readOnly?: boolean;
}

const DefaultValue: FileInputProps["valueComponent"] = (p) => (
  <span>
    {Array.isArray(p.value)
      ? p.value.map((file) => file.name).join(", ")
      : p.value?.name}
  </span>
);

const defaultProps: Partial<FileInputProps> = {
  size: "sm",
  valueComponent: DefaultValue,
  clearButtonTabIndex: 0,
};

const RIGHT_SECTION_WIDTH = {
  xs: 24,
  sm: 30,
  md: 34,
  lg: 40,
  xl: 44,
};

export const _FileInput: ComponentWithRef<FileInputProps, HTMLButtonElement> = (
  props
) => {
  const [local, others] = splitProps(
    useInputProps("FileInput", defaultProps, props),
    [
      "inputProps",
      "wrapperProps",
      "placeholder",
      "value",
      "defaultValue",
      "onChange",
      "multiple",
      "accept",
      "name",
      "form",
      "classNames",
      "styles",
      "unstyled",
      "valueComponent",
      "rightSection",
      "rightSectionWidth",
      "clearable",
      "clearButtonLabel",
      "clearButtonTabIndex",
      "readOnly",
    ]
  );

  let resetRef: any;
  const { classes, theme, cx } = useStyles(null, {
    name: "FileInput",
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
  });

  const [_value, setValue] = useUncontrolled<File | File[]>({
    value: () => local.value,
    defaultValue: local.defaultValue,
    onChange: local.onChange,
    finalValue: local.multiple ? [] : null,
  });

  const hasValue = createMemo(() => {
    const v = _value();
    return Array.isArray(v) ? v.length !== 0 : v !== null;
  });

  const _rightSection =
    local.rightSection ||
    (local.clearable && hasValue() && !local.readOnly ? (
      <CloseButton
        variant="transparent"
        aria-label={local.clearButtonLabel}
        onClick={() => setValue(local.multiple ? [] : null)}
        size={local.inputProps.size}
        tabIndex={local.clearButtonTabIndex}
        unstyled={local.unstyled}
      />
    ) : null);

  createEffect(() => {
    const v = _value();
    if ((Array.isArray(v) && v.length === 0) || v === null) {
      resetRef();
    }
  });

  return (
    <Input.Wrapper {...local.wrapperProps} __staticSelector="FileInput">
      <FileButton
        onChange={setValue}
        multiple={local.multiple}
        accept={local.accept}
        name={local.name}
        form={local.form}
        resetRef={(e) => (resetRef = e)}
        disabled={local.readOnly}
      >
        {(fileButtonProps) => (
          <Input
            multiline
            {...fileButtonProps}
            {...local.inputProps}
            {...others}
            component="button"
            type="button"
            __staticSelector="FileInput"
            rightSection={_rightSection}
            rightSectionWidth={
              local.rightSectionWidth ||
              theme.fn.size({
                size: local.inputProps.size,
                sizes: RIGHT_SECTION_WIDTH,
              })
            }
            classNames={{
              ...local.classNames,
              input: cx(classes.input, (local.classNames as any)?.input),
            }}
          >
            {!hasValue() ? (
              <span class={classes.placeholder}>{local.placeholder}</span>
            ) : (
              <local.valueComponent value={_value()} />
            )}
          </Input>
        )}
      </FileButton>
    </Input.Wrapper>
  );
};

_FileInput.displayName = "@mantine/core/FileInput";

type FileInputComponent = <Multiple extends boolean = false>(
  props: FileInputProps<Multiple> & {
    ref?: HTMLButtonElement;
  }
) => JSXElement;

export const FileInput: FileInputComponent = _FileInput as any;
