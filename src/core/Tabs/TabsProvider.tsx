import { getSafeId } from "utils";
import { useUncontrolled, useId } from "hooks";
import { MantineColor, MantineNumberSize } from "styles";
import { TabsContextProvider } from "./Tabs.context";
import { TABS_ERRORS } from "./Tabs.errors";
import {
  TabsValue,
  TabsOrientation,
  TabsVariant,
  TabsPlacement,
} from "./Tabs.types";
import { JSXElement } from "solid-js";

export interface TabsProviderProps {
  /** Default value for uncontrolled component */
  defaultValue?: TabsValue;

  /** Value for controlled component */
  value?: TabsValue;

  /** Callback for controlled component */
  onTabChange?(value: TabsValue): void;

  /** Tabs orientation, vertical or horizontal */
  orientation?: TabsOrientation;

  /** Tabs.List placement relative to Tabs.Panel, applicable only for orientation="vertical", left by default */
  placement?: TabsPlacement;

  /** Base id, used to generate ids that connect labels with controls, by default generated randomly */
  id?: string;

  /** Determines whether arrow key presses should loop though items (first to last and last to first) */
  loop?: boolean;

  /** Determines whether tab should be activated with arrow key press, defaults to true */
  activateTabWithKeyboard?: boolean;

  /** Determines whether tab can be deactivated, defaults to false */
  allowTabDeactivation?: boolean;

  /** Tabs content */
  children: JSXElement;

  /** Controls component visuals */
  variant?: TabsVariant;

  /** Key of theme.colors */
  color?: MantineColor;

  /** Tabs border-radius from theme.radius or number ti set value from theme, defaults to theme.defaultRadius */
  radius?: MantineNumberSize;

  /** Determines whether tabs should have inverted styles */
  inverted?: boolean;

  /** If set to false, Tabs.Panel content will not stay mounted when tab is not active */
  keepMounted?: boolean;
}

export function TabsProvider(local: TabsProviderProps) {
  const uid = useId(local.id);

  const [_value, onChange] = useUncontrolled<TabsValue>({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: null,
    onChange: local.onTabChange,
  });

  return (
    <TabsContextProvider
      value={{
        placement: local.placement,
        value: _value,
        orientation: local.orientation,
        id: uid,
        loop: local.loop,
        activateTabWithKeyboard: local.activateTabWithKeyboard,
        getTabId: getSafeId(`${uid}-tab`, TABS_ERRORS.value),
        getPanelId: getSafeId(`${uid}-panel`, TABS_ERRORS.value),
        onTabChange: onChange,
        allowTabDeactivation: local.allowTabDeactivation,
        variant: local.variant,
        color: local.color,
        radius: local.radius,
        inverted: local.inverted,
        keepMounted: local.keepMounted === undefined ? true : local.keepMounted,
      }}
    >
      {local.children}
    </TabsContextProvider>
  );
}

TabsProvider.displayName = "@mantine/core/TabsProvider";
