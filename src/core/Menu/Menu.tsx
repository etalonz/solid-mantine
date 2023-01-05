import { getContextItemIndex, useHovered } from "utils";
import { useUncontrolled } from "hooks";
import { ClassNames, Styles, useComponentDefaultProps } from "styles";
import { useDelayedHover } from "../Floating";
import { Popover, PopoverBaseProps, PopoverStylesNames } from "../Popover";
import { MenuDivider, MenuDividerStylesNames } from "./MenuDivider/MenuDivider";
import { MenuDropdown } from "./MenuDropdown/MenuDropdown";
import { MenuItem, MenuItemStylesNames } from "./MenuItem/MenuItem";
import { MenuLabel, MenuLabelStylesName } from "./MenuLabel/MenuLabel";
import { MenuTarget } from "./MenuTarget/MenuTarget";
import { MenuContextProvider } from "./Menu.context";
import { MenuTriggerEvent } from "./Menu.types";
import useStyles from "./Menu.styles";
import { createEffect, JSXElement, on, splitProps } from "solid-js";

export type MenuStylesNames =
  | MenuItemStylesNames
  | MenuLabelStylesName
  | MenuDividerStylesNames
  | PopoverStylesNames;

export interface MenuProps extends PopoverBaseProps {
  /** Menu content */
  children?: JSXElement;

  /** Controlled menu opened state */
  opened?: boolean;

  /** Uncontrolled menu initial opened state */
  defaultOpened?: boolean;

  /** Called when menu opened state changes */
  onChange?(opened: boolean): void;

  /** Called when Menu is opened */
  onOpen?(): void;

  /** Called when Menu is closed */
  onClose?(): void;

  /** Determines whether Menu should be closed when item is clicked */
  closeOnItemClick?: boolean;

  /** Determines whether arrow key presses should loop though items (first to last and last to first) */
  loop?: boolean;

  /** Determines whether dropdown should be closed when Escape key is pressed, defaults to true */
  closeOnEscape?: boolean;

  /** Event which should open menu */
  trigger?: MenuTriggerEvent;

  /** Open delay in ms, applicable only to trigger="hover" variant */
  openDelay?: number;

  /** Close delay in ms, applicable only to trigger="hover" variant */
  closeDelay?: number;

  /** Determines whether dropdown should be closed on outside clicks, default to true */
  closeOnClickOutside?: boolean;

  /** Events that trigger outside clicks */
  clickOutsideEvents?: string[];

  /** id base to create accessibility connections */
  id?: string;

  unstyled?: boolean;
  classNames?: ClassNames<MenuStylesNames>;
  styles?: Styles<MenuStylesNames>;
}

const defaultProps: Partial<MenuProps> = {
  closeOnItemClick: true,
  loop: true,
  trigger: "click",
  openDelay: 0,
  closeDelay: 100,
};

export function Menu(props: MenuProps) {
  const [local, others] = splitProps(
    useComponentDefaultProps("Menu", defaultProps, props),
    [
      "children",
      "onOpen",
      "onClose",
      "opened",
      "defaultOpened",
      "onChange",
      "closeOnItemClick",
      "loop",
      "closeOnEscape",
      "trigger",
      "openDelay",
      "closeDelay",
      "classNames",
      "styles",
      "unstyled",
      "radius",
    ]
  );

  const { classes, cx } = useStyles();

  const [hovered, { setHovered, resetHovered }] = useHovered();
  const [_opened, setOpened] = useUncontrolled({
    value: () => local.opened,
    defaultValue: local.defaultOpened,
    finalValue: false,
    onChange: local.onChange,
  });

  const close = () => {
    const wasOpened = _opened();
    setOpened(false);
    wasOpened && local.onClose?.();
  };

  const open = () => {
    const wasOpened = _opened();
    setOpened(true);
    !wasOpened && local.onOpen?.();
  };

  const toggleDropdown = () => (_opened() ? close() : open());

  const { openDropdown, closeDropdown } = useDelayedHover({
    open,
    close,
    closeDelay: local.closeDelay,
    openDelay: local.openDelay,
  });

  const getItemIndex = (node: HTMLButtonElement) =>
    getContextItemIndex("[data-menu-item]", "[data-menu-dropdown]", node);

  createEffect(on(_opened, resetHovered, { defer: true }));

  return (
    <MenuContextProvider
      value={{
        opened: _opened,
        toggleDropdown,
        getItemIndex,
        hovered,
        setHovered,
        closeOnItemClick: local.closeOnItemClick,
        closeDropdown: local.trigger === "click" ? close : closeDropdown,
        openDropdown: local.trigger === "click" ? open : openDropdown,
        closeDropdownImmediately: close,
        loop: local.loop,
        trigger: local.trigger,
        radius: local.radius,
      }}
    >
      <Popover
        {...others}
        radius={local.radius}
        opened={_opened()}
        onChange={setOpened}
        defaultOpened={local.defaultOpened}
        trapFocus={local.trigger === "click"}
        closeOnEscape={local.closeOnEscape && local.trigger === "click"}
        __staticSelector="Menu"
        classNames={{
          ...local.classNames,
          dropdown: cx(classes.dropdown, local.classNames?.dropdown),
        }}
        styles={local.styles}
        unstyled={local.unstyled}
        onClose={close}
        onOpen={open}
      >
        {local.children}
      </Popover>
    </MenuContextProvider>
  );
}

Menu.displayName = "@mantine/core/Menu";
Menu.Item = MenuItem;
Menu.Label = MenuLabel;
Menu.Dropdown = MenuDropdown;
Menu.Target = MenuTarget;
Menu.Divider = MenuDivider;
