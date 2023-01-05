import { usePagination } from "hooks";
import { Component, For, Show, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
  ComponentWithRef,
} from "styles";
import { Group, GroupProps } from "../Group/Group";
import { DefaultItem, PaginationItemProps } from "./DefaultItem/DefaultItem";
import useStyles, { PaginationStylesParams } from "./Pagination.styles";

export type PaginationStylesNames = Selectors<typeof useStyles>;

export interface PaginationProps
  extends DefaultProps<PaginationStylesNames, PaginationStylesParams>,
    Omit<GroupProps, "classNames" | "styles" | "onChange"> {
  /** Change item component */
  itemComponent?: Component<PaginationItemProps>;

  /** Active item color from theme, defaults to theme.primaryColor */
  color?: MantineColor;

  /** Active initial page for uncontrolled component */
  initialPage?: number;

  /** Controlled active page number */
  page?: number;

  /** Total amount of pages */
  total: number;

  /** Siblings amount on left/right side of selected page */
  siblings?: number;

  /** Amount of elements visible on left/right edges */
  boundaries?: number;

  /** Callback fired after change of each page */
  onChange?: (page: number) => void;

  /** Callback to control aria-labels */
  getItemAriaLabel?: (
    page: number | "dots" | "prev" | "next" | "first" | "last"
  ) => string | undefined;

  /** Spacing between items from theme or number to set value in px, defaults to theme.spacing.xs / 2 */
  spacing?: MantineNumberSize;

  /** Predefined item size or number to set width and height in px */
  size?: MantineNumberSize;

  /** Predefined item radius or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Show/hide jump to start/end controls */
  withEdges?: boolean;

  /** Show/hide prev/next controls */
  withControls?: boolean;

  /** Determines whether all controls should be disabled */
  disabled?: boolean;
}

const defaultProps: Partial<PaginationProps> = {
  itemComponent: DefaultItem,
  initialPage: 1,
  siblings: 1,
  boundaries: 1,
  size: "md",
  radius: "sm",
  withEdges: false,
  withControls: true,
};

export const Pagination: ComponentWithRef<PaginationProps, HTMLDivElement> = (
  props
) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Pagination", defaultProps, props),
    [
      "itemComponent",
      "classNames",
      "styles",
      "page",
      "initialPage",
      "color",
      "total",
      "siblings",
      "boundaries",
      "size",
      "radius",
      "onChange",
      "getItemAriaLabel",
      "spacing",
      "withEdges",
      "withControls",
      "sx",
      "unstyled",
      "disabled",
    ]
  );

  const { classes, theme } = useStyles(
    { color: local.color, size: local.size, radius: local.radius },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Pagination",
    }
  );

  const { range, setPage, next, previous, active, first, last } = usePagination(
    {
      page: local.page,
      siblings: local.siblings,
      total: local.total,
      onChange: local.onChange,
      initialPage: local.initialPage,
      boundaries: local.boundaries,
    }
  );

  const Item = local.itemComponent || DefaultItem;

  return (
    <Group
      role="navigation"
      spacing={
        local.spacing ||
        theme.fn.size({ size: local.size, sizes: theme.spacing }) / 2
      }
      sx={local.sx}
      unstyled={local.unstyled}
      {...others}
    >
      <Show when={local.withEdges}>
        <Item
          page="first"
          onClick={first}
          aria-label={
            local.getItemAriaLabel ? local.getItemAriaLabel("first") : undefined
          }
          aria-disabled={active() === 1 || local.disabled}
          class={classes.item}
          disabled={active() === 1 || local.disabled}
        />
      </Show>

      <Show when={local.withControls}>
        <Item
          page="prev"
          onClick={previous}
          aria-label={
            local.getItemAriaLabel ? local.getItemAriaLabel("prev") : undefined
          }
          aria-disabled={active() === 1 || local.disabled}
          class={classes.item}
          disabled={active() === 1 || local.disabled}
        />
      </Show>

      <For each={range()}>
        {(pageNumber) => (
          <Item
            page={pageNumber}
            active={pageNumber === active()}
            aria-current={pageNumber === active() ? "page" : undefined}
            aria-label={
              typeof local.getItemAriaLabel === "function"
                ? local.getItemAriaLabel(pageNumber)
                : null
            }
            tabIndex={pageNumber === "dots" ? -1 : 0}
            data-dots={pageNumber === "dots" || undefined}
            data-active={pageNumber === active() || undefined}
            class={classes.item}
            onClick={
              pageNumber !== "dots" ? () => setPage(pageNumber) : undefined
            }
            disabled={local.disabled}
          />
        )}
      </For>

      <Show when={local.withControls}>
        <Item
          page="next"
          onClick={next}
          aria-label={
            local.getItemAriaLabel ? local.getItemAriaLabel("next") : undefined
          }
          aria-disabled={active() === local.total || local.disabled}
          class={classes.item}
          disabled={active() === local.total || local.disabled}
        />
      </Show>

      <Show when={local.withEdges}>
        <Item
          page="last"
          onClick={last}
          aria-label={
            local.getItemAriaLabel ? local.getItemAriaLabel("last") : undefined
          }
          aria-disabled={active() === local.total || local.disabled}
          class={classes.item}
          disabled={active() === local.total || local.disabled}
        />
      </Show>
    </Group>
  );
};

Pagination.displayName = "@mantine/core/Pagination";
