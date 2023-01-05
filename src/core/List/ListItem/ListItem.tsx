import { ComponentProps, FlowProps, JSXElement, splitProps } from "solid-js";
import { DefaultProps, Selectors, useContextStylesApi } from "styles";
import { Box } from "../../Box";
import { useListContext } from "../List.context";
import useStyles from "./ListItem.styles";

export type ListItemStylesNames = Selectors<typeof useStyles>;

export interface ListItemProps
  extends DefaultProps<ListItemStylesNames>,
    FlowProps<Omit<ComponentProps<"li">, "ref">> {
  /** Icon to replace bullet */
  icon?: JSXElement;
}

export function ListItem(props: ListItemProps) {
  const [local, others] = splitProps(props, ["className", "children", "icon"]);
  const {
    icon: ctxIcon,
    spacing,
    center,
    listStyleType,
    size,
    withPadding,
  } = useListContext();
  const { classNames, styles, unstyled } = useContextStylesApi();
  const _icon = local.icon || ctxIcon;
  const { classes, cx } = useStyles(
    { withPadding, size, listStyleType, center, spacing },
    { classNames, styles, unstyled, name: "List" }
  );

  return (
    <Box
      component="li"
      className={cx(
        classes.item,
        { [classes.withIcon]: _icon },
        local.className
      )}
      {...others}
    >
      <div class={classes.itemWrapper}>
        {_icon && <span class={classes.itemIcon}>{_icon}</span>}
        {local.children}
      </div>
    </Box>
  );
}

ListItem.displayName = "@mantine/core/ListItem";
