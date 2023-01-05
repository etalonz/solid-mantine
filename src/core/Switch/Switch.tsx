import { useId, useUncontrolled } from "hooks";
import {
  DefaultProps,
  MantineNumberSize,
  MantineSize,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { ForwardRefWithStaticComponents } from "utils";
import { extractSystemStyles } from "../Box";
import { SwitchGroup } from "./SwitchGroup/SwitchGroup";
import { useSwitchGroupContext } from "./SwitchGroup.context";
import { InlineInput, InlineInputStylesNames } from "../InlineInput";
import useStyles, { SwitchStylesParams } from "./Switch.styles";
import { ComponentProps, createMemo, JSXElement, splitProps } from "solid-js";

export type SwitchStylesNames =
  | Selectors<typeof useStyles>
  | InlineInputStylesNames;

export interface SwitchProps
  extends DefaultProps<SwitchStylesNames, SwitchStylesParams>,
    Omit<ComponentProps<"input">, "type" | "size"> {
  /** Id is used to bind input and label, if not passed unique id will be generated for each input */
  id?: string;

  /** Switch label */
  label?: JSXElement;

  /** Inner label when Switch is in unchecked state */
  offLabel?: JSXElement;

  /** Inner label when Switch is in checked state */
  onLabel?: JSXElement;

  /** Switch checked state color from theme.colors, defaults to theme.primaryColor */
  color?: MantineColor;

  /** Predefined size value */
  size?: MantineSize;

  /** Radius from theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Props spread to wrapper element */
  wrapperProps?: Record<string, any>;

  /** Icon inside the thumb of switch */
  thumbIcon?: JSXElement;

  /** Position of label */
  labelPosition?: "left" | "right";

  /** description, displayed after label */
  description?: JSXElement;

  /** Displays error message after input */
  error?: JSXElement;
}

const defaultProps: Partial<SwitchProps> = {
  offLabel: "",
  onLabel: "",
  size: "sm",
  radius: "xl",
  error: false,
};

type SwitchComponent = ForwardRefWithStaticComponents<
  SwitchProps,
  { Group: typeof SwitchGroup }
>;

export const Switch: SwitchComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Switch", defaultProps, props),
    [
      "ref",
      "className",
      "color",
      "label",
      "offLabel",
      "onLabel",
      "id",
      "style",
      "size",
      "radius",
      "wrapperProps",
      "children",
      "unstyled",
      "styles",
      "classNames",
      "thumbIcon",
      "sx",
      "checked",
      "defaultChecked",
      "onChange",
      "labelPosition",
      "description",
      "error",
      "disabled",
    ]
  );

  const ctx = useSwitchGroupContext();

  const { classes } = useStyles(
    {
      size: ctx?.size || local.size,
      color: local.color,
      radius: local.radius,
      labelPosition: local.labelPosition,
      error: !!local.error,
    },
    {
      unstyled: local.unstyled,
      styles: local.styles,
      classNames: local.classNames,
      name: "Switch",
    }
  );

  const { systemStyles, rest } = extractSystemStyles(others);
  const uuid = useId(local.id);

  const contextProps = createMemo(() =>
    ctx
      ? {
          checked: ctx.value().includes(rest.value as string),
          onChange: ctx.onChange,
        }
      : {}
  );

  const [_checked, handleChange] = useUncontrolled({
    value: () => contextProps().checked ?? local.checked,
    defaultValue: local.defaultChecked,
    finalValue: false,
  });

  return (
    <InlineInput
      className={local.className}
      sx={local.sx}
      style={local.style}
      id={uuid}
      size={ctx?.size || local.size}
      labelPosition={local.labelPosition}
      label={local.label}
      description={local.description}
      error={local.error}
      disabled={local.disabled}
      __staticSelector="Switch"
      classNames={local.classNames}
      styles={local.styles}
      unstyled={local.unstyled}
      data-checked={contextProps().checked || undefined}
      {...systemStyles}
      {...local.wrapperProps}
    >
      <input
        {...rest}
        disabled={local.disabled}
        checked={_checked()}
        onChange={(event) => {
          ctx
            ? contextProps().onChange(event)
            : (local.onChange as any)?.(event);
          handleChange(event.currentTarget.checked);
        }}
        id={uuid}
        ref={local.ref}
        type="checkbox"
        class={classes.input}
      />

      <label for={uuid} class={classes.track}>
        <div class={classes.thumb}>{local.thumbIcon}</div>
        <div class={classes.trackLabel}>
          {_checked() ? local.onLabel : local.offLabel}
        </div>
      </label>
    </InlineInput>
  );
};

Switch.displayName = "@mantine/core/Switch";
Switch.Group = SwitchGroup;
