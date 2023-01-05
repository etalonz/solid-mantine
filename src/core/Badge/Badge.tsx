import { JSXElement, ParentProps, splitProps } from "solid-js";
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
import { Box } from "../Box";
import useStyles, { BadgeStylesParams, BadgeVariant } from "./Badge.styles";

export type BadgeStylesNames = Selectors<typeof useStyles>;

export interface BadgeProps
  extends ParentProps<DefaultProps<BadgeStylesNames, BadgeStylesParams>> {
  /** Key of theme.colors */
  color?: MantineColor;

  /** Controls appearance */
  variant?: BadgeVariant;

  /** Controls gradient, applied to gradient variant only */
  gradient?: MantineGradient;

  /** Badge height and font size */
  size?: MantineSize;

  /** Key of theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Sets badge width to 100% of parent element, hides overflow text with text-overflow: ellipsis */
  fullWidth?: boolean;

  /** Section rendered on the left side of label */
  leftSection?: JSXElement;

  /** Section rendered on the right side of label */
  rightSection?: JSXElement;
}

const defaultProps: Partial<BadgeProps> = {
  variant: "light",
  size: "md",
  radius: "xl",
};

export const _Badge: ComponentWithRef<BadgeProps, HTMLDivElement> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Badge", defaultProps, props),
    [
      "className",
      "color",
      "variant",
      "fullWidth",
      "children",
      "size",
      "leftSection",
      "rightSection",
      "radius",
      "gradient",
      "classNames",
      "styles",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    {
      size: local.size,
      fullWidth: local.fullWidth,
      color: local.color,
      radius: local.radius,
      variant: local.variant,
      gradient: local.gradient,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      name: "Badge",
      unstyled: local.unstyled,
    }
  );

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      {local.leftSection && (
        <span class={classes.leftSection}>{local.leftSection}</span>
      )}
      <span class={classes.inner}>{local.children}</span>
      {local.rightSection && (
        <span class={classes.rightSection}>{local.rightSection}</span>
      )}
    </Box>
  );
};

_Badge.displayName = "@mantine/core/Badge";

export const Badge = createPolymorphicComponent<"div", BadgeProps>(_Badge);
