import { ComponentProps, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import useStyles, { SkeletonStylesParams } from "./Skeleton.styles";

export interface SkeletonProps
  extends DefaultProps<never, SkeletonStylesParams>,
    ComponentProps<"div"> {
  /** Should skeleton overlay be displayed */
  visible?: boolean;

  /** Skeleton height */
  height?: number | string;

  /** Skeleton width */
  width?: number | string;

  /** If Skeleton is a circle, it's width and border-radius will be equal to height */
  circle?: boolean;

  /** Radius from theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Whether to show the animation effect */
  animate?: boolean;
}

const defaultProps: Partial<SkeletonProps> = {
  height: "auto",
  width: "100%",
  visible: true,
  animate: true,
};

export const Skeleton: Component<SkeletonProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Skeleton", defaultProps, props),
    [
      "height",
      "width",
      "visible",
      "animate",
      "className",
      "circle",
      "radius",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    {
      height: local.height,
      width: local.width,
      circle: local.circle,
      radius: local.radius,
      animate: local.animate,
    },
    { unstyled: local.unstyled, name: "Skeleton" }
  );

  return (
    <Box
      className={cx(
        classes.root,
        { [classes.visible]: local.visible },
        local.className
      )}
      {...others}
    />
  );
};

Skeleton.displayName = "@mantine/core/Skeleton";
