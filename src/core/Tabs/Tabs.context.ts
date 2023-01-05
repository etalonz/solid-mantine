import { createSafeContext } from "utils";
import { MantineColor, MantineNumberSize } from "styles";
import {
  TabsOrientation,
  TabsPlacement,
  TabsValue,
  TabsVariant,
} from "./Tabs.types";
import { TABS_ERRORS } from "./Tabs.errors";
import { Accessor } from "solid-js";

interface TabsContext {
  id: string;
  value: Accessor<TabsValue>;
  orientation: TabsOrientation;
  loop: boolean;
  activateTabWithKeyboard: boolean;
  allowTabDeactivation: boolean;
  onTabChange(value: TabsValue): void;
  getTabId(value: string): string;
  getPanelId(value: string): string;
  variant: TabsVariant;
  color: MantineColor;
  radius: MantineNumberSize;
  inverted: boolean;
  keepMounted: boolean;
  placement: TabsPlacement;
}

export const [TabsContextProvider, useTabsContext] =
  createSafeContext<TabsContext>(TABS_ERRORS.context);
