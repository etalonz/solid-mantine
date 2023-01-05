import { ComponentProps, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import useStyles, {
  SimpleGridBreakpoint,
  SimpleGridStylesParams,
} from "./SimpleGrid.styles";

export interface SimpleGridProps
  extends DefaultProps<never, SimpleGridStylesParams>,
    ComponentProps<"div"> {
  /** Breakpoints data to change items per row and spacing based on max-width */
  breakpoints?: SimpleGridBreakpoint[];

  /** Default amount of columns, used when none of breakpoints can be applied  */
  cols?: number;

  /** Spacing between columns, used when none of breakpoints can be applied */
  spacing?: MantineNumberSize;

  /** Vertical spacing between columns, used when none of breakpoints can be applied  */
  verticalSpacing?: MantineNumberSize;
}

const defaultProps: Partial<SimpleGridProps> = {
  breakpoints: [],
  cols: 1,
  spacing: "md",
};

export const SimpleGrid: Component<SimpleGridProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("SimpleGrid", defaultProps, props),
    [
      "className",
      "breakpoints",
      "cols",
      "spacing",
      "verticalSpacing",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    {
      breakpoints: local.breakpoints,
      cols: local.cols,
      spacing: local.spacing,
      verticalSpacing: local.verticalSpacing,
    },
    { unstyled: local.unstyled, name: "SimpleGrid" }
  );

  return <Box className={cx(classes.root, local.className)} {...others} />;
};

SimpleGrid.displayName = "@mantine/core/SimpleGrid";
