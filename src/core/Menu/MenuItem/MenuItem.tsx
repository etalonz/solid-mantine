import { mergeRefs } from "@solid-primitives/refs";
import { children, JSXElement, Show, splitProps } from "solid-js";
import {
  ComponentWithRef,
  DefaultProps,
  MantineColor,
  Selectors,
  useContextStylesApi,
} from "styles";
import {
  createEventHandler,
  createPolymorphicComponent,
  createScopedKeydownHandler,
} from "utils";
import { Box } from "../../Box";
import { useMenuContext } from "../Menu.context";
import useStyles from "./MenuItem.styles";

export type MenuItemStylesNames = Selectors<typeof useStyles>;

export interface MenuItemProps extends DefaultProps {
  /** Item label */
  children?: JSXElement;

  /** Key of theme.colors */
  color?: MantineColor;

  /** Determines whether menu should be closed when item is clicked, overrides closeOnItemClick prop on Menu component */
  closeMenuOnClick?: boolean;

  /** Icon rendered on the left side of the label */
  icon?: JSXElement;

  /** Section rendered on the right side of the label */
  rightSection?: JSXElement;
}

export const _MenuItem: ComponentWithRef<MenuItemProps, HTMLButtonElement> = (
  props
) => {
  const [local, others] = splitProps(props, [
    "ref",
    "children",
    "className",
    "color",
    "closeMenuOnClick",
    "icon",
    "rightSection",
  ]);

  const ctx = useMenuContext();
  const { classNames, styles, unstyled } = useContextStylesApi();
  const { classes, cx, theme } = useStyles(
    { radius: ctx.radius, color: local.color },
    { name: "Menu", classNames, styles, unstyled }
  );
  let itemRef: HTMLButtonElement;

  const itemIndex = ctx.getItemIndex(itemRef);
  const _others: any = others;

  const handleMouseLeave = createEventHandler(_others.onMouseLeave, () =>
    ctx.setHovered(-1)
  );
  const handleMouseEnter = createEventHandler(_others.onMouseEnter, () =>
    ctx.setHovered(ctx.getItemIndex(itemRef))
  );

  const handleClick = createEventHandler(_others.onClick, () => {
    if (typeof local.closeMenuOnClick === "boolean") {
      local.closeMenuOnClick && ctx.closeDropdownImmediately();
    } else {
      ctx.closeOnItemClick && ctx.closeDropdownImmediately();
    }
  });

  const handleFocus = createEventHandler(_others.onFocus, () =>
    ctx.setHovered(ctx.getItemIndex(itemRef))
  );

  const Children = children(() => local.children);

  return (
    <Box
      component="button"
      {...others}
      type="button"
      tabIndex={-1}
      onFocus={handleFocus}
      className={cx(classes.item, local.className)}
      ref={mergeRefs((r) => (itemRef = r), local.ref)}
      role="menuitem"
      data-menu-item
      data-hovered={ctx.hovered() === itemIndex ? true : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={createScopedKeydownHandler({
        siblingSelector: "[data-menu-item]",
        parentSelector: "[data-menu-dropdown]",
        activateOnFocus: false,
        loop: ctx.loop,
        dir: theme.dir,
        orientation: "vertical",
        onKeyDown: _others.onKeydown,
      })}
    >
      <Show when={local.icon}>
        <div class={classes.itemIcon}>{local.icon}</div>
      </Show>
      <Show when={Children}>
        <div class={classes.itemLabel}>{Children}</div>
      </Show>
      <Show when={local.rightSection}>
        <div class={classes.itemRightSection}>{local.rightSection}</div>
      </Show>
    </Box>
  );
};

_MenuItem.displayName = "@mantine/core/MenuItem";

export const MenuItem = createPolymorphicComponent<"button", MenuItemProps>(
  _MenuItem
);
