import { ComponentProps, FlowProps, JSX, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { ForwardRefWithStaticComponents } from "utils";
import { Box } from "../Box";
import { Col } from "./Col/Col";
import { GridProvider } from "./Grid.context";
import useStyles from "./Grid.styles";

export interface GridProps
  extends DefaultProps,
    FlowProps<ComponentProps<"div">> {
  /** Spacing between columns predefined value from theme.spacing or number for gutter in px  */
  gutter?: MantineNumberSize;

  /** Should columns in the last row take 100% of grid width */
  grow?: boolean;

  /** Set grid justify-content property */
  justify?: JSX.CSSProperties["justify-content"];

  /** Set grid align-content property */
  align?: JSX.CSSProperties["align-content"];

  /** Amount of columns in each row */
  columns?: number;
}

type GridComponent = ForwardRefWithStaticComponents<
  GridProps,
  { Col: typeof Col }
>;

const defaultProps: Partial<GridProps> = {
  gutter: "md",
  justify: "flex-start",
  align: "stretch",
  columns: 12,
};

export const Grid: GridComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Grid", defaultProps, props),
    [
      "gutter",

      "grow",
      "justify",
      "align",
      "columns",
      "className",
      "id",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    { gutter: local.gutter, justify: local.justify, align: local.align },
    { unstyled: local.unstyled, name: "Grid" }
  );

  return (
    <GridProvider
      value={{ gutter: local.gutter, grow: local.grow, columns: local.columns }}
    >
      <Box className={cx(classes.root, local.className)} {...others} />
    </GridProvider>
  );
};

Grid.Col = Col;
Grid.displayName = "@mantine/core/Grid";
