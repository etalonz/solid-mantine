import { createStyles, MantineNumberSize } from "styles";

interface AvatarGroupStylesParams {
  spacing: MantineNumberSize;
}

export default createStyles((theme, { spacing }: AvatarGroupStylesParams) => ({
  root: {
    display: "flex",
    paddingLeft: theme.fn.size({ size: spacing, sizes: theme.spacing }),
  },
}));
