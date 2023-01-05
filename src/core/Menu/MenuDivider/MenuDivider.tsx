import { ComponentProps, splitProps } from "solid-js";
import { DefaultProps, Selectors, useContextStylesApi } from "styles";
import { Box } from "../../Box";
import useStyles from "./MenuDivider.styles";

export type MenuDividerStylesNames = Selectors<typeof useStyles>;

export interface MenuDividerProps extends DefaultProps, ComponentProps<"div"> {}

export function MenuDivider(props: MenuDividerProps) {
  const [local, others] = splitProps(props, ["className", "children"]);
  const { classNames, styles, unstyled } = useContextStylesApi();
  const { classes, cx } = useStyles(null, {
    name: "Menu",
    classNames,
    styles,
    unstyled,
  });
  return <Box className={cx(classes.divider, local.className)} {...others} />;
}

MenuDivider.displayName = "@mantine/core/MenuDivider";
