import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
  MantineGradient,
  ComponentWithRef,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { UnstyledButton } from "../UnstyledButton";
import useStyles, {
  sizes,
  ActionIconVariant,
  ActionIconStylesParams,
} from "./ActionIcon.styles";
import { Loader, LoaderProps } from "../Loader";
import { ParentProps, splitProps } from "solid-js";

export type ActionIconStylesNames = Selectors<typeof useStyles>;

export interface ActionIconProps
  extends DefaultProps<ActionIconStylesNames, ActionIconStylesParams>,
    ParentProps {
  /** Controls appearance */
  variant?: ActionIconVariant;

  /** Key of theme.colors */
  color?: MantineColor;

  /** Controls gradient settings in gradient variant only */
  gradient?: MantineGradient;

  /** Button border-radius from theme or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Predefined icon size or number to set width and height in px */
  size?: MantineNumberSize;

  /** Props spread to Loader component */
  loaderProps?: LoaderProps;

  /** Indicates loading state */
  loading?: boolean;

  /** Indicates disabled state */
  disabled?: boolean;
}

const defaultProps: Partial<ActionIconProps> = {
  color: "gray",
  size: "md",
  variant: "subtle",
  loading: false,
};

export const _ActionIcon: ComponentWithRef<
  ActionIconProps,
  HTMLButtonElement
> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("ActionIcon", defaultProps, props),
    [
      "className",
      "color",
      "children",
      "radius",
      "size",
      "variant",
      "gradient",
      "disabled",
      "loaderProps",
      "loading",
      "unstyled",
    ]
  );

  const { classes, cx, theme } = useStyles(
    {
      size: local.size,
      radius: local.radius,
      color: local.color,
      variant: local.variant,
      gradient: local.gradient,
    },
    { name: "ActionIcon", unstyled: local.unstyled }
  );

  const colors = theme.fn.variant({
    color: local.color,
    variant: local.variant,
  });

  const loader = (
    <Loader
      color={colors.color}
      size={theme.fn.size({ size: local.size, sizes }) - 12}
      {...local.loaderProps}
    />
  );

  return (
    <UnstyledButton
      className={cx(classes.root, local.className)}
      disabled={local.disabled}
      data-disabled={local.disabled || undefined}
      data-loading={local.loading || undefined}
      unstyled={local.unstyled}
      {...others}
    >
      {local.loading ? loader : local.children}
    </UnstyledButton>
  );
};

_ActionIcon.displayName = "@mantine/core/ActionIcon";

export const ActionIcon = createPolymorphicComponent<"button", ActionIconProps>(
  _ActionIcon
);
