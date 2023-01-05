import { ComponentProps, FlowProps, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineColor,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import useStyles, { CodeStylesParams } from "./Code.styles";

export interface CodeProps
  extends DefaultProps<never, CodeStylesParams>,
    FlowProps<ComponentProps<"code">> {
  /** Code color and background from theme, defaults to gray in light theme and to dark in dark theme */
  color?: MantineColor;

  /** True for code block, false for inline code */
  block?: boolean;
}

export const Code: Component<CodeProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Code", {}, props),
    ["ref", "className", "block", "color", "unstyled"]
  );

  const { classes, cx } = useStyles(
    { color: local.color },
    { name: "Code", unstyled: local.unstyled }
  );

  if (local.block) {
    return (
      <Box
        component="pre"
        dir="ltr"
        className={cx(classes.root, classes.block, local.className)}
        ref={local.ref as any}
        {...others}
      />
    );
  }

  return (
    <Box
      component="code"
      className={cx(classes.root, local.className)}
      dir="ltr"
      ref={local.ref}
      {...others}
    />
  );
};

Code.displayName = "@mantine/core/Code";
