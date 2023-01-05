import {
  ComponentProps,
  FlowProps,
  splitProps,
  createMemo,
  children,
} from "solid-js";
import {
  Selectors,
  DefaultProps,
  useContextStylesApi,
  Component,
} from "styles";
import { packSx } from "utils";
import { Box } from "../../Box";
import { useTabsContext } from "../Tabs.context";
import useStyles from "./TabsPanel.styles";

export type TabsPanelStylesNames = Selectors<typeof useStyles>;

export interface TabsPanelProps
  extends DefaultProps,
    FlowProps<ComponentProps<"div">> {
  /** Value of associated control */
  value: string;
}

export const TabsPanel: Component<TabsPanelProps> = (props) => {
  const [local, others] = splitProps(props, [
    "value",
    "children",
    "sx",
    "className",
  ]);
  const ctx = useTabsContext();
  const { classNames, styles, unstyled } = useContextStylesApi();
  const { classes, cx } = useStyles(
    {
      orientation: ctx.orientation,
      variant: ctx.variant,
      color: ctx.color,
      radius: ctx.radius,
      inverted: ctx.inverted,
      placement: ctx.placement,
    },
    { name: "Tabs", unstyled, classNames, styles }
  );

  const Children = children(() => local.children);

  const active = createMemo(() => ctx.value() === local.value);
  const content = createMemo(() =>
    ctx.keepMounted ? Children() : active() ? Children() : null
  );

  return (
    <Box
      {...others}
      sx={[{ display: !active() ? "none" : undefined }, ...packSx(local.sx)]}
      className={cx(classes.panel, local.className)}
      role="tabpanel"
      id={ctx.getPanelId(local.value)}
      aria-labelledby={ctx.getTabId(local.value)}
    >
      {content()}
    </Box>
  );
};

TabsPanel.displayName = "@mantine/core/TabsPanel";
