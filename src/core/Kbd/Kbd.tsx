import { ComponentProps, FlowProps, splitProps } from "solid-js";
import { DefaultProps, useComponentDefaultProps } from "styles";
import { Box } from "../Box";
import useStyles from "./Kbd.styles";

export interface KbdProps
  extends DefaultProps,
    FlowProps<ComponentProps<"kbd">> {}

export const Kbd = (props: KbdProps) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Kbd", {}, props),
    ["className", "unstyled"]
  );
  const { classes, cx } = useStyles(null, {
    name: "Kbd",
    unstyled: local.unstyled,
  });

  return (
    <Box
      component="kbd"
      className={cx(classes.root, local.className)}
      {...others}
    />
  );
};

Kbd.displayName = "@mantine/core/Kbd";
