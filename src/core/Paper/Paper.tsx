import { JSXElement, splitProps } from "solid-js";
import {
  ComponentWithRef,
  DefaultProps,
  MantineNumberSize,
  MantineShadow,
  useComponentDefaultProps,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { Box } from "../Box";
import useStyles, { PaperStylesParams } from "./Paper.styles";

export interface PaperProps extends DefaultProps<never, PaperStylesParams> {
  /** Predefined box-shadow from theme.shadows (xs, sm, md, lg, xl) or any valid css box-shadow property */
  shadow?: MantineShadow;

  /** Predefined border-radius value from theme.radius or number for border-radius in px */
  radius?: MantineNumberSize;

  /** Adds 1px border with theme.colors.gray[3] color in light color scheme and theme.colors.dark[4] in dark color scheme */
  withBorder?: boolean;

  /** Paper children */
  children?: JSXElement;
}

const defaultProps: Partial<PaperProps> = {};

export const _Paper: ComponentWithRef<PaperProps, HTMLDivElement> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Paper", defaultProps, props),
    ["className", "radius", "withBorder", "shadow", "unstyled"]
  );

  const { classes, cx } = useStyles(
    {
      radius: local.radius,
      shadow: local.shadow,
      withBorder: local.withBorder,
    },
    { name: "Paper", unstyled: local.unstyled }
  );

  return <Box className={cx(classes.root, local.className)} {...others} />;
};

_Paper.displayName = "@mantine/core/Paper";

export const Paper = createPolymorphicComponent<"div", PaperProps>(_Paper);
