import { ComponentProps, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineColor,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import useStyles from "./Mark.styles";

export interface MarkProps extends DefaultProps, ComponentProps<"mark"> {
  /** Background color from theme.colors */
  color?: MantineColor;
}

const defaultProps: Partial<MarkProps> = {
  color: "yellow",
};

export const Mark: Component<MarkProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Mark", defaultProps, props),
    ["color", "className", "unstyled"]
  );

  const { classes, cx } = useStyles(
    { color: local.color },
    { unstyled: local.unstyled, name: "Mark" }
  );
  return (
    <Box
      component="mark"
      className={cx(classes.root, local.className)}
      {...others}
    />
  );
};

Mark.displayName = "@mantine/core/Mark";
