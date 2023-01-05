import { JSX } from "solid-js";
import { DefaultProps, MantineSize, Selectors } from "styles";
import useStyles, { THUMB_SIZES } from "./Thumb.styles";

export type ThumbStylesNames = Selectors<typeof useStyles>;

interface Position {
  x: number;
  y: number;
}

export interface ThumbProps extends DefaultProps<ThumbStylesNames> {
  position: Position;
  size: MantineSize;
  __staticSelector: string;
}

export function Thumb({
  position,
  className,
  styles,
  classNames,
  style,
  size,
  __staticSelector,
  unstyled,
}: ThumbProps) {
  const { classes, cx } = useStyles(
    { size },
    { classNames, styles, name: __staticSelector, unstyled }
  );

  return (
    <div
      class={cx(classes.thumb, className)}
      style={{
        left: `calc(${position.x * 100}% - ${THUMB_SIZES[size] / 2}px)`,
        top: `calc(${position.y * 100}% - ${THUMB_SIZES[size] / 2}px)`,
        ...(style as JSX.CSSProperties),
      }}
    />
  );
}

Thumb.displayName = "@mantine/core/Thumb";
