import {
  DefaultProps,
  MantineNumberSize,
  MantineSize,
  Selectors,
  useComponentDefaultProps,
  ComponentWithRef,
} from "styles";
import { extractSystemStyles } from "../Box";
import { createPolymorphicComponent } from "utils";
import { Box } from "../Box";
import { InputWrapper } from "./InputWrapper/InputWrapper";
import { InputDescription } from "./InputDescription/InputDescription";
import { InputLabel } from "./InputLabel/InputLabel";
import { InputError } from "./InputError/InputError";
import { useInputWrapperContext } from "./InputWrapper.context";
import useStyles, { InputVariant } from "./Input.styles";
import { JSXElement, splitProps } from "solid-js";

export type InputStylesNames = Selectors<typeof useStyles>;

export interface InputSharedProps {
  /** Adds icon on the left side of input */
  icon?: JSXElement;

  /** Width of icon section in px */
  iconWidth?: number;

  /** Right section of input, similar to icon but on the right */
  rightSection?: JSXElement;

  /** Width of right section, is used to calculate input padding-right */
  rightSectionWidth?: number;

  /** Props spread to rightSection div element */
  rightSectionProps?: Record<string, any>;

  /** Properties spread to root element */
  wrapperProps?: Record<string, any>;

  /** Sets required on input element */
  required?: boolean;

  /** Input border-radius from theme or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Defines input appearance, defaults to default in light color scheme and filled in dark */
  variant?: InputVariant;

  /** Disabled input state */
  disabled?: boolean;

  /** Input size */
  size?: MantineSize;

  placeholder?: string;
}

export interface InputProps
  extends InputSharedProps,
    DefaultProps<InputStylesNames> {
  /** Static css selector base */
  __staticSelector?: string;

  /** Sets border color to red and aria-invalid=true on input element */
  invalid?: boolean;

  /** Will input have multiple lines? */
  multiline?: boolean;

  /** Determines whether cursor on input should be pointer */
  pointer?: boolean;
}

const defaultProps: Partial<InputProps> = {
  rightSectionWidth: 36,
  size: "sm",
  variant: "default",
};

export const _Input: ComponentWithRef<InputProps, HTMLInputElement> = (
  props
) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Input", defaultProps, props) as InputProps & {
      onChange: (e: Event) => void;
    },
    [
      "onChange",
      "className",
      "invalid",
      "required",
      "disabled",
      "variant",
      "icon",
      "style",
      "rightSectionWidth",
      "iconWidth",
      "rightSection",
      "rightSectionProps",
      "radius",
      "size",
      "wrapperProps",
      "classNames",
      "styles",
      "__staticSelector",
      "multiline",
      "sx",
      "unstyled",
      "pointer",
    ]
  );
  const { offsetBottom, offsetTop } = useInputWrapperContext();

  const { classes, cx } = useStyles(
    {
      radius: local.radius,
      size: local.size,
      multiline: local.multiline,
      variant: local.variant,
      invalid: local.invalid,
      rightSectionWidth: local.rightSectionWidth,
      iconWidth: local.iconWidth,
      withRightSection: !!local.rightSection,
      offsetBottom,
      offsetTop,
      pointer: local.pointer,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      name: ["Input", local.__staticSelector],
      unstyled: local.unstyled,
    }
  );

  const { systemStyles, rest } = extractSystemStyles(others);

  return (
    <Box
      className={cx(classes.wrapper, local.className)}
      sx={local.sx}
      style={local.style}
      {...systemStyles}
      {...local.wrapperProps}
    >
      {local.icon && <div class={classes.icon}>{local.icon}</div>}

      <Box
        component="input"
        {...rest}
        onInput={local.onChange}
        required={local.required}
        aria-invalid={local.invalid}
        disabled={local.disabled}
        className={cx(classes[`${local.variant}Variant`], classes.input, {
          [classes.withIcon]: local.icon,
          [classes.invalid]: local.invalid,
          [classes.disabled]: local.disabled,
        })}
      />

      {local.rightSection && (
        <div {...local.rightSectionProps} class={classes.rightSection}>
          {local.rightSection}
        </div>
      )}
    </Box>
  );
};

_Input.displayName = "@mantine/core/Input";
const __Input = _Input as any;
__Input.Wrapper = InputWrapper;
__Input.Label = InputLabel;
__Input.Description = InputDescription;
__Input.Error = InputError;

export const Input = createPolymorphicComponent<
  "input",
  InputProps,
  {
    Wrapper: typeof InputWrapper;
    Label: typeof InputLabel;
    Description: typeof InputDescription;
    Error: typeof InputError;
  }
>(_Input);
