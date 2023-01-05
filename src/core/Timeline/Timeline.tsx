import { ComponentProps, createMemo, For, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineColor,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { ForwardRefWithStaticComponents, packSx } from "utils";
import { Box } from "../Box";
import {
  TimelineItem,
  TimelineItemProps,
  TimelineItemStylesNames,
} from "./TimelineItem/TimelineItem";

export interface TimelineProps
  extends DefaultProps<TimelineItemStylesNames>,
    Omit<ComponentProps<"div">, "children"> {
  /** <Timeline.Item /> components only */
  items: TimelineItemProps[];

  /** Index of active element */
  active?: number;

  /** Active color from theme */
  color?: MantineColor;

  /** Radius from theme.radius, or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Bullet size in px */
  bulletSize?: number;

  /** Timeline alignment */
  align?: "right" | "left";

  /** Line width in px */
  lineWidth?: number;

  /** Reverse active direction without reversing items */
  reverseActive?: boolean;
}

type TimelineComponent = ForwardRefWithStaticComponents<
  TimelineProps,
  { Item: typeof TimelineItem }
>;

const defaultProps: Partial<TimelineProps> = {
  active: -1,
  radius: "xl",
  bulletSize: 20,
  align: "left",
  lineWidth: 4,
  reverseActive: false,
};

export const Timeline: TimelineComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Timeline", defaultProps, props),
    [
      "items",
      "active",
      "color",
      "radius",
      "bulletSize",
      "align",
      "lineWidth",
      "classNames",
      "styles",
      "sx",
      "reverseActive",
      "unstyled",
    ]
  );

  const itemProps = (item: TimelineItemProps, index: number) => ({
    ...item,
    classNames: local.classNames,
    styles: local.styles,
    align: local.align,
    lineWidth: local.lineWidth,
    radius: item.radius || local.radius,
    color: item.color || local.color,
    bulletSize: item.bulletSize || local.bulletSize,
    unstyled: local.unstyled,
    active:
      item.active ||
      (local.reverseActive
        ? local.active >= local.items.length - index - 1
        : local.active >= index),
    lineActive:
      item.lineActive ||
      (local.reverseActive
        ? local.active >= local.items.length - index - 1
        : local.active - 1 >= index),
  });

  const offset = createMemo(() =>
    local.align === "left"
      ? { paddingLeft: local.bulletSize / 2 + local.lineWidth / 2 }
      : { paddingRight: local.bulletSize / 2 + local.lineWidth / 2 }
  );

  return (
    <Box sx={[offset(), ...packSx(local.sx)]} {...others}>
      <For each={local.items}>
        {(item, idx) => <TimelineItem {...itemProps(item, idx())} />}
      </For>
    </Box>
  );
};

Timeline.Item = TimelineItem;
Timeline.displayName = "@mantine/core/Timeline";
