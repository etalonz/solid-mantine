import { JSXElement, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  Selectors,
} from "styles";
import { Box } from "../../Box";
import { Marks, MarksStylesNames } from "../Marks/Marks";
import { sizes } from "../SliderRoot/SliderRoot.styles";
import useStyles from "./Track.styles";

export type TrackStylesNames = Selectors<typeof useStyles> | MarksStylesNames;

export interface TrackProps extends DefaultProps<TrackStylesNames> {
  filled: number;
  offset?: number;
  marksOffset?: number;
  marks: { value: number; label?: JSXElement }[];
  size: MantineNumberSize;
  radius: MantineNumberSize;
  color: MantineColor;
  min: number;
  max: number;
  value: number;
  children: JSXElement;
  onChange(value: number): void;
  onMouseEnter?(event?: MouseEvent): void;
  onMouseLeave?(event?: MouseEvent): void;
  disabled: boolean;
  inverted?: boolean;
}

export function Track(props: TrackProps) {
  const [local, others] = splitProps(props, [
    "filled",
    "size",
    "color",
    "classNames",
    "styles",
    "radius",
    "children",
    "offset",
    "onMouseLeave",
    "onMouseEnter",
    "disabled",
    "marksOffset",
    "unstyled",
    "inverted",
  ]);

  const { classes } = useStyles(
    {
      color: local.color,
      size: local.size,
      radius: local.radius,
      disabled: local.disabled,
      inverted: local.inverted,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Slider",
    }
  );

  return (
    <div
      class={classes.track}
      onMouseLeave={local.onMouseLeave}
      onMouseEnter={local.onMouseEnter}
    >
      <Box
        className={classes.bar}
        sx={(theme) => ({
          left: `calc(${local.offset}% - ${theme.fn.size({
            size: local.size,
            sizes,
          })}px)`,
          width: `calc(${local.filled}% + ${theme.fn.size({
            size: local.size,
            sizes,
          })}px)`,
        })}
      />

      {local.children}

      <Marks
        {...others}
        size={local.size}
        color={local.color}
        offset={local.marksOffset}
        classNames={local.classNames}
        styles={local.styles}
        disabled={local.disabled}
        unstyled={local.unstyled}
        inverted={local.inverted}
      />
    </div>
  );
}

Track.displayName = "@mantine/core/SliderTrack";
