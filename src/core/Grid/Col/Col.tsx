import { ComponentProps, JSX, splitProps } from "solid-js";
import { Component, DefaultProps, useComponentDefaultProps } from "styles";
import { Box } from "../../Box";
import { useGridContext } from "../Grid.context";
import useStyles, { ColSpan } from "./Col.styles";

export interface ColProps extends DefaultProps, ComponentProps<"div"> {
  /** Default col span */
  span?: ColSpan;

  /** Column left offset */
  offset?: number;

  /** Default col order */
  order?: JSX.CSSProperties["order"];

  /** Col order at (min-width: theme.breakpoints.xs) */
  orderXs?: JSX.CSSProperties["order"];

  /** Col order at (min-width: theme.breakpoints.sm) */
  orderSm?: JSX.CSSProperties["order"];

  /** Col order at (min-width: theme.breakpoints.md) */
  orderMd?: JSX.CSSProperties["order"];

  /** Col order at (min-width: theme.breakpoints.lg) */
  orderLg?: JSX.CSSProperties["order"];

  /** Col order at (min-width: theme.breakpoints.xl) */
  orderXl?: JSX.CSSProperties["order"];

  /** Column left offset at (min-width: theme.breakpoints.xs) */
  offsetXs?: number;

  /** Column left offset at (min-width: theme.breakpoints.sm) */
  offsetSm?: number;

  /** Column left offset at (min-width: theme.breakpoints.md) */
  offsetMd?: number;

  /** Column left offset at (min-width: theme.breakpoints.lg) */
  offsetLg?: number;

  /** Column left offset at (min-width: theme.breakpoints.xl) */
  offsetXl?: number;

  /** Col span at (min-width: theme.breakpoints.xs) */
  xs?: ColSpan;

  /** Col span at (min-width: theme.breakpoints.sm) */
  sm?: ColSpan;

  /** Col span at (min-width: theme.breakpoints.md) */
  md?: ColSpan;

  /** Col span at (min-width: theme.breakpoints.lg) */
  lg?: ColSpan;

  /** Col span at (min-width: theme.breakpoints.xl) */
  xl?: ColSpan;
}

const defaultProps: Partial<ColProps> = {};

function isValidSpan(span: ColSpan) {
  if (span === "auto" || span === "content") {
    return true;
  }
  return typeof span === "number" && span > 0 && span % 1 === 0;
}

export const Col: Component<ColProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Grid.Col", defaultProps, props),
    [
      "span",
      "offset",
      "offsetXs",
      "offsetSm",
      "offsetMd",
      "offsetLg",
      "offsetXl",
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "order",
      "orderXs",
      "orderSm",
      "orderMd",
      "orderLg",
      "orderXl",
      "className",
      "id",
      "unstyled",
    ]
  );

  const ctx = useGridContext();

  if (!ctx) {
    throw new Error(
      "[@mantine/core] Grid.Col was used outside of Grid context"
    );
  }

  const colSpan = local.span || ctx.columns;
  const { classes, cx } = useStyles(
    {
      gutter: ctx.gutter,
      offset: local.offset,
      offsetXs: local.offsetXs,
      offsetSm: local.offsetSm,
      offsetMd: local.offsetMd,
      offsetLg: local.offsetLg,
      offsetXl: local.offsetXl,
      xs: local.xs,
      sm: local.sm,
      md: local.md,
      lg: local.lg,
      xl: local.xl,
      order: local.order,
      orderXs: local.orderXs,
      orderSm: local.orderSm,
      orderMd: local.orderMd,
      orderLg: local.orderLg,
      orderXl: local.orderXl,
      grow: ctx.grow,
      columns: ctx.columns,
      span: colSpan,
    },
    { unstyled: local.unstyled, name: "Col" }
  );

  if (!isValidSpan(colSpan) || colSpan > ctx.columns) {
    return null;
  }

  return <Box className={cx(classes.root, local.className)} {...others} />;
};

Col.displayName = "@mantine/core/Col";
