import { ComponentProps, JSX, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import { filterFalsyChildren } from "./filter-falsy-children/filter-falsy-children";
import useStyles, { GroupPosition } from "./Group.styles";

export interface GroupProps extends DefaultProps, ComponentProps<"div"> {
  /** Defines justify-content property */
  position?: GroupPosition;

  /** Defined flex-wrap property */
  noWrap?: boolean;

  /** Defines flex-grow property for each element, true -> 1, false -> 0 */
  grow?: boolean;

  /** Space between elements */
  spacing?: MantineNumberSize;

  /** Defines align-items css property */
  align?: JSX.CSSProperties["align-items"];
}

const defaultProps: Partial<GroupProps> = {
  position: "left",
  spacing: "md",
};

export const Group: Component<GroupProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Group", defaultProps, props),
    [
      "className",
      "position",
      "align",
      "children",
      "noWrap",
      "grow",
      "spacing",
      "unstyled",
    ]
  );

  const filteredChildren = filterFalsyChildren(local.children);
  const { classes, cx } = useStyles(
    {
      align: local.align,
      grow: local.grow,
      noWrap: local.noWrap,
      spacing: local.spacing,
      position: local.position,
      count: filteredChildren.length,
    },
    { unstyled: local.unstyled, name: "Group" }
  );

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      {filteredChildren}
    </Box>
  );
};

Group.displayName = "@mantine/core/Group";
