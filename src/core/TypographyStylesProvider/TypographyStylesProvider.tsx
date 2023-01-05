import { ComponentProps, FlowProps, splitProps } from "solid-js";
import { Component, DefaultProps, useComponentDefaultProps } from "styles";
import { Box } from "../Box";
import useStyles from "./TypographyStylesProvider.styles";

export interface TypographyStylesProviderProps
  extends DefaultProps,
    FlowProps<ComponentProps<"div">> {}

export const TypographyStylesProvider: Component<
  TypographyStylesProviderProps
> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("TypographyStylesProvider", {}, props),
    ["className", "unstyled"]
  );
  const { classes, cx } = useStyles(null, {
    name: "TypographyStylesProvider",
    unstyled: local.unstyled,
  });
  return <Box className={cx(classes.root, local.className)} {...others} />;
};

TypographyStylesProvider.displayName = "@mantine/core/TypographyStylesProvider";
