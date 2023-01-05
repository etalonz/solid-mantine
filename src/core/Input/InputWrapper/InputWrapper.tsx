import { ComponentProps, ParentProps, splitProps, createMemo } from "solid-js";
import {
  DefaultProps,
  MantineSize,
  Selectors,
  useComponentDefaultProps,
  Component,
} from "styles";
import { Box } from "../../Box";
import { InputLabel, InputLabelStylesNames } from "../InputLabel/InputLabel";
import { InputError, InputErrorStylesNames } from "../InputError/InputError";
import {
  InputDescription,
  InputDescriptionStylesNames,
} from "../InputDescription/InputDescription";
import { InputWrapperProvider } from "../InputWrapper.context";
import { getInputOffsets } from "./get-input-offsets";
import useStyles from "./InputWrapper.styles";
import { JSXElement } from "solid-js";

export type InputWrapperStylesNames =
  | Selectors<typeof useStyles>
  | InputLabelStylesNames
  | InputErrorStylesNames
  | InputDescriptionStylesNames;

export interface InputWrapperBaseProps {
  /** Input label, displayed before input */
  label?: JSXElement;

  /** Input description, displayed after label */
  description?: JSXElement;

  /** Displays error message after input */
  error?: JSXElement;

  /** Adds required attribute to the input and red asterisk on the right side of label */
  required?: boolean;

  /** Determines whether required asterisk should be rendered, overrides required prop, does not add required attribute to the input */
  withAsterisk?: boolean;

  /** Props spread to label element */
  labelProps?: Record<string, any>;

  /** Props spread to description element */
  descriptionProps?: Record<string, any>;

  /** Props spread to error element */
  errorProps?: Record<string, any>;

  /** Input container component, defaults to React.Fragment */
  inputContainer?(children: JSXElement): JSXElement;

  /** Controls order of the Input.Wrapper elements */
  inputWrapperOrder?: ("label" | "input" | "description" | "error")[];
}

export interface InputWrapperProps
  extends DefaultProps<InputWrapperStylesNames>,
    InputWrapperBaseProps,
    ComponentProps<"div">,
    ParentProps {
  /** htmlFor label prop */
  id?: string;

  /** Render label as label with htmlFor or as div */
  labelElement?: "label" | "div";

  /** Controls all elements font-size */
  size?: MantineSize;

  /** Static css selector base */
  __staticSelector?: string;
}

const defaultProps: Partial<InputWrapperProps> = {
  labelElement: "label",
  size: "sm",
  inputContainer: (children) => children,
  inputWrapperOrder: ["label", "description", "input", "error"],
};

export const InputWrapper: Component<InputWrapperProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("InputWrapper", defaultProps, props),
    [
      "className",
      "label",
      "children",
      "required",
      "id",
      "error",
      "description",
      "labelElement",
      "labelProps",
      "descriptionProps",
      "errorProps",
      "classNames",
      "styles",
      "size",
      "inputContainer",
      "__staticSelector",
      "unstyled",
      "inputWrapperOrder",
      "withAsterisk",
    ]
  );

  const { classes, cx } = useStyles(null, {
    classNames: local.classNames,
    styles: local.styles,
    name: ["InputWrapper", local.__staticSelector],
    unstyled: local.unstyled,
  });

  const sharedProps = {
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    size: local.size,
    __staticSelector: local.__staticSelector,
  };

  const isRequired = createMemo(() =>
    typeof local.withAsterisk === "boolean"
      ? local.withAsterisk
      : local.required
  );

  const _label = local.label && (
    <InputLabel
      labelElement={local.labelElement}
      id={local.id ? `${local.id}-label` : undefined}
      for={local.id}
      required={isRequired()}
      {...sharedProps}
      {...local.labelProps}
    >
      {local.label}
    </InputLabel>
  );

  const _description = local.description && (
    <InputDescription
      {...local.descriptionProps}
      {...sharedProps}
      size={local.descriptionProps?.size || sharedProps.size}
    >
      {local.description}
    </InputDescription>
  );

  const _input = <>{local.inputContainer(local.children)}</>;

  const _error = typeof local.error !== "boolean" && local.error && (
    <InputError
      {...local.errorProps}
      {...sharedProps}
      size={local.errorProps?.size || sharedProps.size}
    >
      {local.error}
    </InputError>
  );

  const content = local.inputWrapperOrder.map((part) => {
    switch (part) {
      case "label":
        return _label;
      case "input":
        return _input;
      case "description":
        return _description;
      case "error":
        return _error;
      default:
        return null;
    }
  });

  return (
    <InputWrapperProvider
      value={getInputOffsets(local.inputWrapperOrder, {
        hasDescription: !!_description,
        hasError: !!_error,
      })}
    >
      <Box className={cx(classes.root, local.className)} {...others}>
        {content}
      </Box>
    </InputWrapperProvider>
  );
};

InputWrapper.displayName = "@mantine/core/InputWrapper";
