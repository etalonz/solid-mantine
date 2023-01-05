import { createStyles, MantineNumberSize } from "styles";
import { JSX } from "solid-js";

export interface GridStylesParams {
  gutter: MantineNumberSize;
  justify?: JSX.CSSProperties["justify-content"];
  align?: JSX.CSSProperties["align-content"];
}

export default createStyles(
  (theme, { justify, align, gutter }: GridStylesParams) => ({
    root: {
      margin: -theme.fn.size({ size: gutter, sizes: theme.spacing }) / 2,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: justify,
      alignItems: align,
    },
  })
);
