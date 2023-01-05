import TextareaAutosize from "./Autosize";
import { useId } from "hooks";
import {
  DefaultProps,
  MantineSize,
  useComponentDefaultProps,
  Component,
} from "styles";
import { extractSystemStyles } from "../Box";
import { InputWrapperBaseProps, Input, InputSharedProps } from "../Input";
import { TextInputStylesNames } from "../TextInput/TextInput";
import useStyles from "./Textarea.styles";
import { ComponentProps, createMemo, splitProps } from "solid-js";

export interface TextareaProps
  extends DefaultProps<TextInputStylesNames>,
    InputWrapperBaseProps,
    InputSharedProps,
    ComponentProps<"textarea"> {
  /** Id is used to bind input and label, if not passed unique id will be generated for each input */
  id?: string;

  /** If true textarea will grow with content until maxRows are reached  */
  autosize?: boolean;

  /** Defines maxRows in autosize variant, not applicable to regular variant */
  maxRows?: number;

  /** Defined minRows in autosize variant and rows in regular variant */
  minRows?: number;

  /** Props passed to root element */
  wrapperProps?: Record<string, any>;

  /** Input size */
  size?: MantineSize;

  /** Static selectors base */
  __staticSelector?: string;
}

const defaultProps: Partial<TextareaProps> = {
  autosize: false,
  size: "sm",
  __staticSelector: "Textarea",
};

export const Textarea: Component<TextareaProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Textarea", defaultProps, props),
    [
      "ref",
      "autosize",
      "maxRows",
      "minRows",
      "label",
      "error",
      "description",
      "id",
      "className",
      "required",
      "style",
      "wrapperProps",
      "classNames",
      "styles",
      "size",
      "__staticSelector",
      "sx",
      "errorProps",
      "descriptionProps",
      "labelProps",
      "inputWrapperOrder",
      "inputContainer",
      "unstyled",
      "withAsterisk",
    ]
  );

  const uuid = useId(local.id);
  const { classes, cx } = useStyles();
  const { systemStyles, rest } = extractSystemStyles(others);
  const sharedProps = createMemo(() => ({
    required: local.required,
    ref: local.ref,
    invalid: !!local.error,
    id: uuid,
    classNames: {
      ...local.classNames,
      input: cx(classes.input, local.classNames?.input),
    },
    styles: local.styles,
    __staticSelector: local.__staticSelector,
    size: local.size,
    multiline: true,
    unstyled: local.unstyled,
    ...rest,
  }));

  return (
    <Input.Wrapper
      label={local.label}
      error={local.error}
      id={uuid}
      description={local.description}
      required={local.required}
      style={local.style}
      className={local.className}
      classNames={local.classNames}
      styles={local.styles}
      size={local.size}
      __staticSelector={local.__staticSelector}
      sx={local.sx}
      errorProps={local.errorProps}
      labelProps={local.labelProps}
      descriptionProps={local.descriptionProps}
      inputContainer={local.inputContainer}
      inputWrapperOrder={local.inputWrapperOrder}
      unstyled={local.unstyled}
      withAsterisk={local.withAsterisk}
      {...systemStyles}
      {...local.wrapperProps}
    >
      {local.autosize ? (
        <Input<typeof TextareaAutosize>
          {...sharedProps()}
          component={TextareaAutosize}
          maxRows={local.maxRows}
          minRows={local.minRows}
        />
      ) : (
        <Input<"textarea">
          {...sharedProps()}
          component="textarea"
          rows={local.minRows}
        />
      )}
    </Input.Wrapper>
  );
};

Textarea.displayName = "@mantine/core/Textarea";
