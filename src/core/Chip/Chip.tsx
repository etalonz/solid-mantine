import { useId, useUncontrolled } from "hooks";
import {
  DefaultProps,
  MantineNumberSize,
  MantineSize,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { extractSystemStyles } from "../Box";
import { ForwardRefWithStaticComponents } from "utils";
import { Box } from "../Box";
import { CheckIcon } from "../Checkbox";
import { ChipGroup } from "./ChipGroup/ChipGroup";
import { useChipGroup } from "./ChipGroup.context";
import useStyles, { ChipStylesParams } from "./Chip.styles";
import {
  ComponentProps,
  createMemo,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";

export type ChipStylesNames = Selectors<typeof useStyles>;

export interface ChipProps
  extends DefaultProps<ChipStylesNames, ChipStylesParams>,
    Omit<ComponentProps<"input">, "size" | "onChange"> {
  /** Chip radius from theme or number to set value in px */
  radius?: MantineNumberSize;

  /** Predefined chip size */
  size?: MantineSize;

  /** Chip input type */
  type?: "radio" | "checkbox";

  /** Controls chip appearance, defaults to filled with dark theme and to outline in light theme */
  variant?: "outline" | "filled";

  /** Chip label */
  children: JSXElement;

  /** Checked state for controlled component */
  checked?: boolean;

  /** Default value for uncontrolled component */
  defaultChecked?: boolean;

  /** Calls when checked state changes */
  onChange?(checked: boolean): void;

  /** Active color from theme, defaults to theme.primaryColor */
  color?: MantineColor;

  /** Static id to bind input with label */
  id?: string;

  /** Props spread to wrapper element */
  wrapperProps?: Record<string, any>;
}

const defaultProps: Partial<ChipProps> = {
  type: "checkbox",
  size: "sm",
  radius: "xl",
  variant: "outline",
};

type ChipComponent = ForwardRefWithStaticComponents<
  ChipProps,
  { Group: typeof ChipGroup }
>;

export const Chip: ChipComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Chip", defaultProps, props),
    [
      "radius",
      "type",
      "size",
      "variant",
      "disabled",
      "id",
      "color",
      "children",
      "className",
      "classNames",
      "style",
      "styles",
      "checked",
      "defaultChecked",
      "onChange",
      "sx",
      "wrapperProps",
      "value",
      "unstyled",
    ]
  );

  const ctx = useChipGroup();

  const uuid = useId(local.id);
  const { systemStyles, rest } = extractSystemStyles(others);
  const { classes, cx } = useStyles(
    { radius: local.radius, size: local.size, color: local.color },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Chip",
    }
  );

  const [_value, setValue] = useUncontrolled({
    value: () => local.checked,
    defaultValue: local.defaultChecked,
    finalValue: false,
    onChange: local.onChange,
  });

  const contextProps = createMemo(() =>
    ctx
      ? {
          checked: ctx.isChipSelected(local.value as string),
          onChange: ctx.onChange,
          type: ctx.multiple ? "checkbox" : "radio",
        }
      : {}
  );

  const _checked = createMemo(() => contextProps().checked || _value());

  return (
    <Box
      className={cx(classes.root, local.className)}
      style={local.style}
      sx={local.sx}
      {...systemStyles}
      {...local.wrapperProps}
    >
      <input
        type={contextProps().type || local.type}
        class={classes.input}
        checked={_checked()}
        onChange={
          contextProps().onChange ||
          ((event) => setValue(event.currentTarget.checked))
        }
        id={uuid}
        disabled={local.disabled}
        value={local.value}
        {...rest}
      />
      <label
        for={uuid}
        data-checked={_checked() || undefined}
        data-disabled={local.disabled || undefined}
        data-variant={local.variant}
        class={classes.label}
      >
        <Show when={_checked()}>
          <span class={classes.iconWrapper}>
            <CheckIcon class={classes.checkIcon} />
          </span>
        </Show>
        {local.children}
      </label>
    </Box>
  );
};

Chip.displayName = "@mantine/core/Chip";
Chip.Group = ChipGroup;
