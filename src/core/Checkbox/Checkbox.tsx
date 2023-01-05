import {
  DefaultProps,
  MantineSize,
  MantineColor,
  Selectors,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { extractSystemStyles } from "../Box";
import { ForwardRefWithStaticComponents } from "utils";
import { useId } from "hooks";
import { Box } from "../Box";
import { CheckboxIcon } from "./CheckboxIcon";
import { CheckboxGroup } from "./CheckboxGroup/CheckboxGroup";
import { useCheckboxGroupContext } from "./CheckboxGroup.context";
import useStyles, { CheckboxStylesParams } from "./Checkbox.styles";
import { Input } from "../Input";
import {
  Component,
  ComponentProps,
  createEffect,
  createMemo,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";

export type CheckboxStylesNames = Selectors<typeof useStyles>;

export interface CheckboxProps
  extends DefaultProps<CheckboxStylesNames, CheckboxStylesParams>,
    Omit<ComponentProps<"input">, "type" | "size"> {
  /** Key of theme.colors */
  color?: MantineColor;

  /** Key of theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Predefined label font-size and checkbox width and height in px */
  size?: MantineSize;

  /** Checkbox label */
  label?: JSXElement;

  /** Indeterminate state of checkbox, overwrites checked */
  indeterminate?: boolean;

  /** Props spread to wrapper element */
  wrapperProps?: Record<string, any>;

  /** id to connect label with input */
  id?: string;

  /** Transition duration in ms */
  transitionDuration?: number;

  /** Icon rendered when checkbox has checked or indeterminate state */
  icon?: Component<{ indeterminate: boolean; className: string }>;

  /** Position of label */
  labelPosition?: "left" | "right";

  /** description, displayed after label */
  description?: JSXElement;

  /** Displays error message after input */
  error?: JSXElement;
}

const defaultProps: Partial<CheckboxProps> = {
  size: "sm",
  transitionDuration: 100,
  icon: CheckboxIcon,
  labelPosition: "right",
};

type CheckboxComponent = ForwardRefWithStaticComponents<
  CheckboxProps,
  { Group: typeof CheckboxGroup }
>;

export const Checkbox: CheckboxComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Checkbox", defaultProps, props),
    [
      "onChange",
      "className",
      "style",
      "sx",
      "checked",
      "disabled",
      "color",
      "label",
      "indeterminate",
      "id",
      "size",
      "radius",
      "wrapperProps",
      "children",
      "classNames",
      "styles",
      "transitionDuration",
      "icon",
      "unstyled",
      "labelPosition",
      "description",
      "error",
    ]
  );

  const ctx = useCheckboxGroupContext();
  const uuid = useId(local.id);

  const { systemStyles, rest } = extractSystemStyles(others);
  const { classes, cx } = useStyles(
    {
      size: ctx?.size || local.size,
      radius: local.radius,
      color: local.color,
      transitionDuration: local.transitionDuration,
      labelPosition: local.labelPosition,
      error: !!local.error,
      indeterminate: local.indeterminate,
    },
    {
      name: "Checkbox",
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );

  const contextProps = createMemo(() =>
    ctx
      ? {
          checked: ctx.value().includes(rest.value as string),
          onChange: ctx.onChange as any,
        }
      : {}
  );

  return (
    <Box
      className={cx(classes.root, local.className)}
      sx={local.sx}
      style={local.style}
      {...systemStyles}
      {...local.wrapperProps}
    >
      <div class={cx(classes.body)}>
        <div class={classes.inner}>
          <input
            id={uuid}
            type="checkbox"
            class={classes.input}
            checked={contextProps().checked || local.checked}
            onChange={contextProps().onChange || local.onChange}
            disabled={local.disabled}
            {...rest}
          />

          <local.icon
            indeterminate={local.indeterminate}
            className={classes.icon}
          />
        </div>

        <div class={classes.labelWrapper}>
          <Show when={local.label}>
            <label
              class={classes.label}
              data-disabled={local.disabled || undefined}
              for={uuid}
              data-testid="label"
            >
              {local.label}
            </label>
          </Show>

          <Show when={local.description}>
            <Input.Description className={classes.description}>
              {local.description}
            </Input.Description>
          </Show>

          <Show when={local.error && local.error !== "boolean"}>
            <Input.Error className={classes.error}>{local.error}</Input.Error>
          </Show>
        </div>
      </div>
    </Box>
  );
};

Checkbox.displayName = "@mantine/core/Checkbox";
Checkbox.Group = CheckboxGroup;
