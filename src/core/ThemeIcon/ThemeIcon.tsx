import { ComponentProps, FlowProps, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  MantineGradient,
  MantineColor,
  useComponentDefaultProps,
  Component,
} from "styles";
import { Box } from "../Box";
import useStyles, {
  ThemeIconVariant,
  ThemeIconStylesParams,
} from "./ThemeIcon.styles";

export interface ThemeIconProps
  extends DefaultProps<never, ThemeIconStylesParams>,
    FlowProps<ComponentProps<"div">> {
  /** Predefined width and height or number for width and height in px */
  size?: MantineNumberSize;

  /** Predefined border-radius from theme.radius or number for border-radius in px */
  radius?: MantineNumberSize;

  /** Icon color from theme */
  color?: MantineColor;

  /** Controls appearance */
  variant?: ThemeIconVariant;

  /** Controls gradient settings in gradient variant only */
  gradient?: MantineGradient;
}

const defaultProps: Partial<ThemeIconProps> = {
  size: "md",
  variant: "filled",
};

export const ThemeIcon: Component<ThemeIconProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("ThemeIcon", defaultProps, props),
    ["className", "size", "radius", "variant", "color", "gradient", "unstyled"]
  );

  const { classes, cx } = useStyles(
    {
      variant: local.variant,
      radius: local.radius,
      color: local.color,
      size: local.size,
      gradient: local.gradient,
    },
    { name: "ThemeIcon", unstyled: local.unstyled }
  );

  return <Box className={cx(classes.root, local.className)} {...others} />;
};

ThemeIcon.displayName = "@mantine/core/ThemeIcon";
