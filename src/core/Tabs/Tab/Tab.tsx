import {
  ComponentProps,
  createMemo,
  JSXElement,
  ParentProps,
  splitProps,
} from "solid-js";
import {
  DefaultProps,
  Selectors,
  useContextStylesApi,
  MantineColor,
  Component,
} from "styles";
import { createScopedKeydownHandler } from "utils";
import { UnstyledButton } from "../../UnstyledButton";
import { useTabsContext } from "../Tabs.context";
import useStyles from "./Tab.styles";

export type TabStylesNames = Selectors<typeof useStyles>;

export interface TabProps
  extends DefaultProps,
    ParentProps<ComponentProps<"button">> {
  /** Value that is used to connect Tab with associated panel */
  value: string;

  /** Section of content displayed after label */
  rightSection?: JSXElement;

  /** Section of content displayed before label */
  icon?: JSXElement;

  /** Key of theme.colors */
  color?: MantineColor;
}

export const Tab: Component<TabProps> = (props) => {
  const [local, others] = splitProps(props, [
    "value",
    "children",
    "onKeyDown",
    "onClick",
    "className",
    "icon",
    "rightSection",
    "color",
  ]);

  const ctx = useTabsContext();
  const { classNames, styles, unstyled } = useContextStylesApi();

  const hasIcon = createMemo(() => !!local.icon);
  const hasRightSection = createMemo(() => !!local.rightSection);

  const { theme, classes, cx } = useStyles(
    {
      withIcon: hasIcon() || (hasRightSection() && !local.children),
      withRightSection: hasRightSection() || (hasIcon() && !local.children),
      orientation: ctx.orientation,
      color: local.color || ctx.color,
      variant: ctx.variant,
      radius: ctx.radius,
      inverted: ctx.inverted,
      placement: ctx.placement,
    },
    { name: "Tabs", unstyled, classNames, styles }
  );

  const isActive = createMemo(() => local.value === ctx.value());
  const activateTab = (event: MouseEvent) => {
    ctx.onTabChange(
      ctx.allowTabDeactivation
        ? local.value === ctx.value()
          ? null
          : local.value
        : local.value
    );
    (local.onClick as any)?.(event);
  };

  return (
    <UnstyledButton<"button">
      {...others}
      unstyled={unstyled}
      className={cx(classes.tab, local.className)}
      data-active={isActive() || undefined}
      type="button"
      role="tab"
      id={ctx.getTabId(local.value)}
      aria-selected={isActive()}
      tabIndex={isActive() || ctx.value === null ? 0 : -1}
      aria-controls={ctx.getPanelId(local.value)}
      onClick={activateTab}
      onKeyDown={createScopedKeydownHandler({
        siblingSelector: '[role="tab"]',
        parentSelector: '[role="tablist"]',
        activateOnFocus: ctx.activateTabWithKeyboard,
        loop: ctx.loop,
        dir: theme.dir,
        orientation: ctx.orientation,
        onKeyDown: local.onKeyDown as any,
      })}
    >
      {local.icon && <div class={classes.tabIcon}>{local.icon}</div>}
      {local.children && <div class={classes.tabLabel}>{local.children}</div>}
      {local.rightSection && (
        <div class={classes.tabRightSection}>{local.rightSection}</div>
      )}
    </UnstyledButton>
  );
};

Tab.displayName = "@mantine/core/Tab";
