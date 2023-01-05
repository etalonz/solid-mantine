import { ComponentProps, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
  MantineSize,
  Component,
} from "styles";
import { Box } from "../Box";
import useStyles from "./Container.styles";

export interface ContainerProps extends DefaultProps, ComponentProps<"div"> {
  /** Predefined container max-width or number for max-width in px */
  size?: MantineNumberSize;

  /** If fluid is set to true, size prop is ignored and Container can expand to 100% of width */
  fluid?: boolean;

  /** Container sizes */
  sizes?: Record<MantineSize, number>;
}

const defaultProps: Partial<ContainerProps> = {
  sizes: {
    xs: 540,
    sm: 720,
    md: 960,
    lg: 1140,
    xl: 1320,
  },
};

export const Container: Component<ContainerProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Container", defaultProps, props),
    ["className", "fluid", "size", "unstyled", "sizes"]
  );

  const { classes, cx } = useStyles(
    { fluid: local.fluid, size: local.size, sizes: local.sizes },
    { unstyled: local.unstyled, name: "Container" }
  );
  return <Box className={cx(classes.root, local.className)} {...others} />;
};

Container.displayName = "@mantine/core/Container";
