import { Accessor } from "solid-js";
import { MantineNumberSize } from "styles";
import { createSafeContext } from "utils";
import { MENU_ERRORS } from "./Menu.errors";
import { MenuTriggerEvent } from "./Menu.types";

interface MenuContext {
  toggleDropdown(): void;
  closeDropdownImmediately(): void;
  closeDropdown(): void;
  openDropdown(): void;
  getItemIndex(node: HTMLButtonElement): number;
  setHovered(index: number): void;
  hovered: Accessor<number>;
  closeOnItemClick: boolean;
  loop: boolean;
  trigger: MenuTriggerEvent;
  radius: MantineNumberSize;
  opened: Accessor<boolean>;
}

export const [MenuContextProvider, useMenuContext] =
  createSafeContext<MenuContext>(MENU_ERRORS.context);
