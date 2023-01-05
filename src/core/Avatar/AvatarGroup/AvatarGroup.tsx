import { FlowProps, ComponentProps, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../../Box";
import { AvatarGroupProvider } from "./AvatarGroup.context";
import useStyles from "./AvatarGroup.styles";

export interface AvatarGroupProps
  extends DefaultProps,
    FlowProps<ComponentProps<"div">> {
  /** Negative space between Avatars */
  spacing?: MantineNumberSize;
}

const defaultProps: Partial<AvatarGroupProps> = {};

export const AvatarGroup: Component<AvatarGroupProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("AvatarGroup", defaultProps, props),
    ["spacing", "unstyled", "className"]
  );

  const { classes, cx } = useStyles(
    { spacing: local.spacing || "sm" },
    { name: "AvatarGroup", unstyled: local.unstyled }
  );

  return (
    <AvatarGroupProvider spacing={local.spacing || "sm"}>
      <Box className={cx(classes.root, local.className)} {...others} />
    </AvatarGroupProvider>
  );
};

AvatarGroup.displayName = "@mantine/core/AvatarGroup";
