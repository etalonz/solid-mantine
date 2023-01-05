import { useId } from "hooks";
import {
  DefaultProps,
  MantineSize,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { ForwardRefWithStaticComponents } from "utils";
import { extractSystemStyles } from "../Box";
import { RadioIcon } from "./RadioIcon";
import { useRadioGroupContext } from "./RadioGroup.context";
import { RadioGroup } from "./RadioGroup/RadioGroup";
import { InlineInput, InlineInputStylesNames } from "../InlineInput";
import useStyles, { RadioStylesParams } from "./Radio.styles";
import {
  Component,
  ComponentProps,
  createMemo,
  JSXElement,
  splitProps,
} from "solid-js";

export type RadioStylesNames =
  | Selectors<typeof useStyles>
  | InlineInputStylesNames;

export interface RadioProps
  extends DefaultProps<RadioStylesNames, RadioStylesParams>,
    Omit<ComponentProps<"input">, "size"> {
  /** Radio label */
  label?: JSXElement;

  /** Active radio color from theme.colors */
  color?: MantineColor;

  /** Predefined label fontSize, radio width, height and border-radius */
  size?: MantineSize;

  /** Replace default icon */
  icon?: Component<ComponentProps<"svg">>;

  /** Animation duration in ms */
  transitionDuration?: number;

  /** Props spread to root element */
  wrapperProps?: Record<string, any>;

  /** Position of label */
  labelPosition?: "left" | "right";

  /** description, displayed after label */
  description?: JSXElement;

  /** Displays error message after input */
  error?: JSXElement;
}

const defaultProps: Partial<RadioProps> = {
  icon: RadioIcon,
  transitionDuration: 100,
  size: "sm",
  labelPosition: "right",
};

type RadioComponent = ForwardRefWithStaticComponents<
  RadioProps,
  { Group: typeof RadioGroup }
>;

export const Radio: RadioComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Radio", defaultProps, props),
    [
      "value",
      "ref",
      "className",
      "style",
      "id",
      "label",
      "size",
      "title",
      "disabled",
      "color",
      "classNames",
      "styles",
      "sx",
      "icon",
      "transitionDuration",
      "wrapperProps",
      "unstyled",
      "labelPosition",
      "description",
      "error",
    ]
  );

  const ctx = useRadioGroupContext();

  const contextSize = createMemo(() => ctx?.size ?? local.size);
  const componentSize = createMemo(() =>
    props.size ? local.size : contextSize()
  );

  const { classes } = useStyles(
    {
      color: local.color,
      size: componentSize(),
      transitionDuration: local.transitionDuration,
      labelPosition: local.labelPosition,
      error: !!local.error,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Radio",
    }
  );

  const { systemStyles, rest } = extractSystemStyles(others);
  const uuid = useId(local.id);

  const contextProps = createMemo(() =>
    ctx
      ? {
          checked: ctx.value() === local.value,
          name: rest.name ?? ctx.name,
          onChange: ctx.onChange,
        }
      : {}
  );

  return (
    <InlineInput
      className={local.className}
      sx={local.sx}
      style={local.style}
      id={uuid}
      size={componentSize()}
      labelPosition={local.labelPosition}
      label={local.label}
      description={local.description}
      error={local.error}
      disabled={local.disabled}
      __staticSelector="Radio"
      classNames={local.classNames}
      styles={local.styles}
      unstyled={local.unstyled}
      data-checked={contextProps().checked || undefined}
      {...systemStyles}
      {...local.wrapperProps}
    >
      <div class={classes.inner}>
        <input
          ref={local.ref}
          class={classes.radio}
          type="radio"
          id={uuid}
          disabled={local.disabled}
          {...rest}
          {...contextProps()}
        />
        <local.icon class={classes.icon} aria-hidden />
      </div>
    </InlineInput>
  );
};

Radio.displayName = "@mantine/core/Radio";
Radio.Group = RadioGroup;
