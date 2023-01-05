import { createStyles, MantineNumberSize } from "styles";
import { JSX } from "solid-js";

export interface StackStylesParams {
  spacing: MantineNumberSize;
  align: JSX.CSSProperties["align-items"];
  justify: JSX.CSSProperties["justify-content"];
}

export default createStyles(
  (theme, { spacing, align, justify }: StackStylesParams) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: align,
      justifyContent: justify,
      gap: theme.fn.size({ size: spacing, sizes: theme.spacing }),
    },
  })
);
