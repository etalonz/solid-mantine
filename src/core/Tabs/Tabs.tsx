import {
  DefaultProps,
  useComponentDefaultProps,
  StylesApiProvider,
  Selectors,
} from "styles";
import { ForwardRefWithStaticComponents } from "utils";
import { Box } from "../Box";
import { TabsList, TabsListStylesNames } from "./TabsList/TabsList";
import { TabsPanel, TabsPanelStylesNames } from "./TabsPanel/TabsPanel";
import { Tab, TabStylesNames } from "./Tab/Tab";
import { TabsProvider, TabsProviderProps } from "./TabsProvider";
import { TabsStylesParams } from "./Tabs.types";
import useStyles from "./Tabs.styles";
import { ComponentProps, splitProps } from "solid-js";

export type TabsStylesNames =
  | Selectors<typeof useStyles>
  | TabsListStylesNames
  | TabsPanelStylesNames
  | TabStylesNames;

export interface TabsProps
  extends TabsProviderProps,
    DefaultProps<TabsStylesNames, TabsStylesParams>,
    Omit<ComponentProps<"div">, keyof TabsProviderProps> {}

type TabsComponent = ForwardRefWithStaticComponents<
  TabsProps,
  {
    List: typeof TabsList;
    Tab: typeof Tab;
    Panel: typeof TabsPanel;
  }
>;

const defaultProps: Partial<TabsProps> = {
  orientation: "horizontal",
  loop: true,
  activateTabWithKeyboard: true,
  allowTabDeactivation: false,
  unstyled: false,
  inverted: false,
  variant: "default",
  placement: "left",
};

export const Tabs: TabsComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Tabs", defaultProps, props),
    [
      "defaultValue",
      "value",
      "orientation",
      "loop",
      "activateTabWithKeyboard",
      "allowTabDeactivation",
      "id",
      "onTabChange",
      "variant",
      "color",
      "className",
      "unstyled",
      "classNames",
      "styles",
      "radius",
      "inverted",
      "keepMounted",
      "placement",
    ]
  );

  const { classes, cx } = useStyles(
    {
      orientation: local.orientation,
      color: local.color,
      variant: local.variant,
      radius: local.radius,
      inverted: local.inverted,
      placement: local.placement,
    },
    {
      unstyled: local.unstyled,
      name: "Tabs",
      classNames: local.classNames,
      styles: local.styles,
    }
  );

  return (
    <StylesApiProvider
      classNames={local.classNames}
      styles={local.styles}
      unstyled={local.unstyled}
    >
      <TabsProvider
        activateTabWithKeyboard={local.activateTabWithKeyboard}
        defaultValue={local.defaultValue}
        orientation={local.orientation}
        onTabChange={local.onTabChange}
        value={local.value}
        id={local.id}
        loop={local.loop}
        allowTabDeactivation={local.allowTabDeactivation}
        color={local.color}
        variant={local.variant}
        radius={local.radius}
        inverted={local.inverted}
        keepMounted={local.keepMounted}
        placement={local.placement}
      >
        <Box
          {...others}
          className={cx(classes.root, local.className)}
          id={local.id}
        />
      </TabsProvider>
    </StylesApiProvider>
  );
};

Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;

Tabs.displayName = "@mantine/core/Tabs";
