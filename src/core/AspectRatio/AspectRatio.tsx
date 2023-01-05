import { ComponentProps, splitProps } from "solid-js";
import { Component, DefaultProps, useComponentDefaultProps } from "styles";
import { Box } from "../Box/Box";
import useStyles from "./AspectRatio.styles";

export interface AspectRatioProps extends DefaultProps, ComponentProps<"div"> {
  /** Aspect ratio, e.g. 16 / 9, 4 / 3, 1920 / 1080 */
  ratio: number;
}

export const AspectRatio: Component<AspectRatioProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("AspectRatio", {}, props),
    ["className", "ratio", "unstyled"]
  );

  const { classes, cx } = useStyles(
    { ratio: local.ratio },
    { name: "AspectRatio", unstyled: local.unstyled }
  );

  return <Box className={cx(classes.root, local.className)} {...others} />;
};

AspectRatio.displayName = "@mantine/core/AspectRatio";
