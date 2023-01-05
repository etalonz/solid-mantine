import { ComponentProps, JSXElement, splitProps } from "solid-js";
import { DefaultProps, Selectors, useContextStylesApi } from "styles";
import { Text } from "../../Text";
import useStyles from "./MenuLabel.styles";

export type MenuLabelStylesName = Selectors<typeof useStyles>;

export interface MenuLabelProps extends DefaultProps, ComponentProps<"div"> {
  /** Label content */
  children?: JSXElement;
}

export function MenuLabel(props: MenuLabelProps) {
  const [local, others] = splitProps(props, ["className", "children"]);
  const { classNames, styles, unstyled } = useContextStylesApi();
  const { classes, cx } = useStyles(null, {
    name: "Menu",
    classNames,
    styles,
    unstyled,
  });
  return (
    <Text className={cx(classes.label, local.className)} {...others}>
      {local.children}
    </Text>
  );
}

MenuLabel.displayName = "@mantine/core/MenuLabel";
