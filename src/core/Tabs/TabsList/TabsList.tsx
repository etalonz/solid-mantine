import {
  Component,
  DefaultProps,
  Selectors,
  useContextStylesApi,
} from "styles";
import { Box } from "../../Box";
import { TabsPosition } from "../Tabs.types";
import { useTabsContext } from "../Tabs.context";
import useStyles from "./TabsList.styles";
import { ComponentProps, FlowProps, splitProps } from "solid-js";

export type TabsListStylesNames = Selectors<typeof useStyles>;

export interface TabsListProps
  extends DefaultProps,
    FlowProps<ComponentProps<"div">> {
  /** Determines whether tabs should take the whole space */
  grow?: boolean;

  /** Tabs alignment */
  position?: TabsPosition;
}

export const TabsList: Component<TabsListProps> = (props) => {
  const [local, others] = splitProps(props, ["className", "grow", "position"]); // grow = false, position = left

  const { orientation, variant, color, radius, inverted, placement } =
    useTabsContext();
  const { classNames, styles, unstyled } = useContextStylesApi();
  const { classes, cx } = useStyles(
    {
      orientation,
      grow: local.grow === undefined ? false : local.grow,
      variant,
      color,
      position: local.position || "left",
      radius,
      inverted,
      placement,
    },
    { name: "Tabs", unstyled, classNames, styles }
  );

  return (
    <Box
      {...others}
      className={cx(classes.tabsList, local.className)}
      role="tablist"
      aria-orientation={orientation}
    />
  );
};

TabsList.displayName = "@mantine/core/TabsList";
