import { ComponentProps, JSX, splitProps } from "solid-js";
import {
  DefaultProps,
  useComponentDefaultProps,
  MantineNumberSize,
  Component,
} from "styles";
import { Box } from "../Box";
import useStyles, { StackStylesParams } from "./Stack.styles";

export interface StackProps
  extends DefaultProps<never, StackStylesParams>,
    ComponentProps<"div"> {
  /** Key of theme.spacing or number to set gap in px */
  spacing?: MantineNumberSize;

  /** align-items CSS property */
  align?: JSX.CSSProperties["align-items"];

  /** justify-content CSS property */
  justify?: JSX.CSSProperties["justify-content"];
}

const defaultProps: Partial<StackProps> = {
  spacing: "md",
  align: "stretch",
  justify: "top",
};

export const Stack: Component<StackProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Stack", defaultProps, props),
    ["spacing", "className", "align", "justify", "unstyled"]
  );

  const { classes, cx } = useStyles(
    { spacing: local.spacing, align: local.align, justify: local.justify },
    { name: "Stack", unstyled: local.unstyled }
  );
  return <Box className={cx(classes.root, local.className)} {...others} />;
};

Stack.displayName = "@mantine/core/Stack";
