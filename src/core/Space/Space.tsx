import { splitProps } from "solid-js";
import {
  ComponentWithRef,
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { packSx } from "utils";
import { Box } from "../Box";

export interface SpaceProps extends DefaultProps {
  /** Width, set to add horizontal spacing */
  w?: MantineNumberSize;

  /** Height, set to add vertical spacing */
  h?: MantineNumberSize;
}

const defaultProps: Partial<SpaceProps> = {
  w: 0,
  h: 0,
};

export const Space: ComponentWithRef<SpaceProps, HTMLDivElement> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Space", defaultProps, props),
    ["w", "h", "sx"]
  );

  return (
    <Box
      sx={[
        (theme) => {
          const width = theme.fn.size({ size: local.w, sizes: theme.spacing });
          const height = theme.fn.size({ size: local.h, sizes: theme.spacing });
          return { width, height, minWidth: width, minHeight: height };
        },
        ...packSx(local.sx),
      ]}
      {...others}
    />
  );
};

Space.displayName = "@mantine/core/Space";
