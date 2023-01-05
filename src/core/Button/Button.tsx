import {
  DefaultProps,
  MantineSize,
  MantineNumberSize,
  MantineGradient,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
  ComponentWithRef,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { UnstyledButton } from "../UnstyledButton";
import { Loader, LoaderProps } from "../Loader";
import { ButtonGroup } from "./ButtonGroup/ButtonGroup";
import useStyles, {
  sizes,
  ButtonVariant,
  ButtonStylesParams,
} from "./Button.styles";
import { JSXElement, ParentProps, splitProps } from "solid-js";

export type ButtonStylesNames = Selectors<typeof useStyles>;

export interface ButtonProps
  extends DefaultProps<ButtonStylesNames, ButtonStylesParams>,
    ParentProps {
  /** Predefined button size */
  size?: MantineSize;

  /** Button type attribute */
  type?: "submit" | "button" | "reset";

  /** Button color from theme */
  color?: MantineColor;

  /** Adds icon before button label  */
  leftIcon?: JSXElement;

  /** Adds icon after button label  */
  rightIcon?: JSXElement;

  /** Sets button width to 100% of parent element */
  fullWidth?: boolean;

  /** Button border-radius from theme or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Controls button appearance */
  variant?: ButtonVariant;

  /** Controls gradient settings in gradient variant only */
  gradient?: MantineGradient;

  /** Set text-transform to uppercase */
  uppercase?: boolean;

  /** Reduces vertical and horizontal spacing */
  compact?: boolean;

  /** Indicate loading state */
  loading?: boolean;

  /** Props spread to Loader component */
  loaderProps?: LoaderProps;

  /** Loader position relative to button label */
  loaderPosition?: "left" | "right";

  /** Disabled state */
  disabled?: boolean;
}

const defaultProps: Partial<ButtonProps> = {
  size: "sm",
  type: "button",
  variant: "filled",
  loaderPosition: "left",
};

export const _Button: ComponentWithRef<ButtonProps, HTMLButtonElement> = (
  props
) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Button", defaultProps, props),
    [
      "className",
      "size",
      "color",
      "type",
      "disabled",
      "children",
      "leftIcon",
      "rightIcon",
      "fullWidth",
      "variant",
      "radius",
      "uppercase",
      "compact",
      "loading",
      "loaderPosition",
      "loaderProps",
      "gradient",
      "classNames",
      "styles",
      "unstyled",
    ]
  );

  const { classes, cx, theme } = useStyles(
    {
      radius: local.radius,
      color: local.color,
      size: local.size,
      fullWidth: local.fullWidth,
      compact: local.compact,
      gradient: local.gradient,
      variant: local.variant,
      withLeftIcon: !!local.leftIcon,
      withRightIcon: !!local.rightIcon,
    },
    {
      name: "Button",
      unstyled: local.unstyled,
      classNames: local.classNames,
      styles: local.styles,
    }
  );

  const colors = theme.fn.variant({
    color: local.color,
    variant: local.variant,
  });

  const loader = (
    <Loader
      color={colors.color}
      size={theme.fn.size({ size: local.size, sizes }).height / 2}
      {...local.loaderProps}
    />
  );

  return (
    <UnstyledButton
      className={cx(classes.root, local.className)}
      type={local.type}
      disabled={local.disabled}
      data-button
      data-disabled={local.disabled || undefined}
      data-loading={local.loading || undefined}
      unstyled={local.unstyled}
      {...others}
    >
      <div class={classes.inner}>
        {(local.leftIcon ||
          (local.loading && local.loaderPosition === "left")) && (
          <span class={cx(classes.icon, classes.leftIcon)}>
            {local.loading && local.loaderPosition === "left"
              ? loader
              : local.leftIcon}
          </span>
        )}

        <span
          class={classes.label}
          style={{
            "text-transform": local.uppercase ? "uppercase" : undefined,
          }}
        >
          {local.children}
        </span>

        {(local.rightIcon ||
          (local.loading && local.loaderPosition === "right")) && (
          <span class={cx(classes.icon, classes.rightIcon)}>
            {local.loading && local.loaderPosition === "right"
              ? loader
              : local.rightIcon}
          </span>
        )}
      </div>
    </UnstyledButton>
  );
};

_Button.displayName = "@mantine/core/Button";
(_Button as any).Group = ButtonGroup;

export const Button = createPolymorphicComponent<
  "button",
  ButtonProps,
  { Group: typeof ButtonGroup }
>(_Button);
