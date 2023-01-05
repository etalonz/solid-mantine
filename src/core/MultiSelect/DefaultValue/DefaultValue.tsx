import {
  DefaultProps,
  MantineSize,
  MantineNumberSize,
  Selectors,
} from "styles";
import { InputVariant } from "../../Input";
import { CloseButton } from "../../CloseButton";
import useStyles from "./DefaultValue.styles";
import { ComponentProps, Show, splitProps } from "solid-js";

export type DefaultValueStylesNames = Selectors<typeof useStyles>;

export interface MultiSelectValueProps
  extends DefaultProps<DefaultValueStylesNames>,
    ComponentProps<"div"> {
  label: string;
  onRemove(): void;
  disabled: boolean;
  readOnly: boolean;
  size: MantineSize;
  radius: MantineNumberSize;
  variant: InputVariant;
}

const buttonSizes = {
  xs: 16,
  sm: 22,
  md: 24,
  lg: 26,
  xl: 30,
};

export function DefaultValue(props: MultiSelectValueProps) {
  const [local, others] = splitProps(props, [
    "label",
    "classNames",
    "styles",
    "className",
    "onRemove",
    "disabled",
    "readOnly",
    "size",
    "radius",
    "variant",
  ]);

  const { classes, cx } = useStyles(
    {
      size: local.size,
      disabled: local.disabled,
      readOnly: local.readOnly,
      radius: local.radius || "sm",
      variant: local.variant,
    },
    { classNames: local.classNames, styles: local.styles, name: "MultiSelect" }
  );

  return (
    <div class={cx(classes.defaultValue, local.className)} {...others}>
      <span class={classes.defaultValueLabel}>{local.label}</span>

      <Show when={!local.disabled && !local.readOnly}>
        <CloseButton
          aria-hidden
          onMouseDown={local.onRemove}
          size={buttonSizes[local.size]}
          radius={2}
          color="blue"
          variant="transparent"
          iconSize={buttonSizes[local.size] / 2}
          className={classes.defaultValueRemove}
          tabIndex={-1}
        />
      </Show>
    </div>
  );
}

DefaultValue.displayName = "@mantine/core/MultiSelect/DefaultValue";
