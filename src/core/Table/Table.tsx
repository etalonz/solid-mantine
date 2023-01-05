import { ComponentProps, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import useStyles, { TableStylesParams } from "./Table.styles";

export interface TableProps
  extends DefaultProps<never, TableStylesParams>,
    ComponentProps<"table"> {
  /** If true every odd row of table will have gray background color */
  striped?: boolean;

  /** If true row will have hover color */
  highlightOnHover?: boolean;

  /** Table caption position */
  captionSide?: "top" | "bottom";

  /** Horizontal cells spacing from theme.spacing or number to set value in px */
  horizontalSpacing?: MantineNumberSize;

  /** Vertical cells spacing from theme.spacing or number to set value in px */
  verticalSpacing?: MantineNumberSize;

  /** Sets font size of all text inside table */
  fontSize?: MantineNumberSize;

  /** Add border to table */
  withBorder?: boolean;

  /** Add border to columns */
  withColumnBorders?: boolean;
}

const defaultProps: Partial<TableProps> = {
  striped: false,
  highlightOnHover: false,
  captionSide: "top",
  horizontalSpacing: "xs",
  fontSize: "sm",
  verticalSpacing: 7,
  withBorder: false,
  withColumnBorders: false,
};

export const Table: Component<TableProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Table", defaultProps, props),
    [
      "className",
      "striped",
      "highlightOnHover",
      "captionSide",
      "horizontalSpacing",
      "verticalSpacing",
      "fontSize",
      "unstyled",
      "withBorder",
      "withColumnBorders",
    ]
  );

  const { classes, cx } = useStyles(
    {
      captionSide: local.captionSide,
      verticalSpacing: local.verticalSpacing,
      horizontalSpacing: local.horizontalSpacing,
      fontSize: local.fontSize,
      withBorder: local.withBorder,
      withColumnBorders: local.withColumnBorders,
    },
    { unstyled: local.unstyled, name: "Table" }
  );

  return (
    <Box
      {...others}
      component="table"
      className={cx(classes.root, local.className)}
      data-striped={local.striped || undefined}
      data-hover={local.highlightOnHover || undefined}
    />
  );
};

Table.displayName = "@mantine/core/Table";
