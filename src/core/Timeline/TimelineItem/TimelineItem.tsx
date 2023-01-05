import {
  DefaultProps,
  MantineColor,
  Selectors,
  MantineNumberSize,
} from "styles";
import { Text } from "../../Text";
import { Box } from "../../Box";
import useStyles from "./TimelineItem.styles";
import { ComponentProps, JSXElement, splitProps } from "solid-js";

export type TimelineItemStylesNames = Selectors<typeof useStyles>;

export interface TimelineItemProps
  extends DefaultProps<TimelineItemStylesNames>,
    Omit<ComponentProps<"div">, "title"> {
  /** Item title, rendered next to bullet */
  title?: JSXElement;

  /** React node that should be rendered inside bullet – icon, image, avatar, etc. */
  bullet?: JSXElement;

  /** Bullet width, height and border-radius in px, controlled by Timeline component */
  bulletSize?: number;

  /** Radius from theme.radius, or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** React node that will be rendered after title */
  children?: JSXElement;

  /** Should this item be highlighted, controlled by Timeline component */
  active?: boolean;

  /** Should line of this item be highlighted, controlled by Timeline component */
  lineActive?: boolean;

  /** Highlight color for active item */
  color?: MantineColor;

  /** Line and bullet position relative to item content, controlled by Timeline component */
  align?: "right" | "left";

  /** Line border style */
  lineVariant?: "solid" | "dashed" | "dotted";

  /** Line border width in px, controlled by Timeline component */
  lineWidth?: number;
}

export function TimelineItem(props: TimelineItemProps) {
  const [local, others] = splitProps(props, [
    "className",
    "bullet",
    "title",
    "bulletSize",
    "radius",
    "lineWidth",
    "active",
    "lineActive",
    "classNames",
    "styles",
    "children",
    "color",
    "align",
    "lineVariant",
    "unstyled",
  ]); // bulletsize = 20, radius = xl, linewiddth = 4, linevariant = solid

  const { classes, cx } = useStyles(
    {
      bulletSize: local.bulletSize || 20,
      color: local.color,
      radius: local.radius || "xl",
      align: local.align,
      lineVariant: local.lineVariant || "solid",
      lineWidth: local.lineWidth || 4,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Timeline",
    }
  );

  return (
    <Box
      className={cx(classes.item, local.className)}
      data-line-active={local.lineActive || undefined}
      data-active={local.active || undefined}
      {...others}
    >
      <div
        class={classes.itemBullet}
        data-with-child={!!local.bullet || undefined}
        data-active={local.active || undefined}
      >
        {local.bullet}
      </div>

      <div class={classes.itemBody}>
        {local.title && (
          <Text className={classes.itemTitle}>{local.title}</Text>
        )}
        <div class={classes.itemContent}>{local.children}</div>
      </div>
    </Box>
  );
}

TimelineItem.displayName = "@mantine/core/TimelineItem";
