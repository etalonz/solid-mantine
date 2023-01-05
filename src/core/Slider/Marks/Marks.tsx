import { For, JSXElement, Show } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  Selectors,
} from "styles";
import { Box } from "../../Box";
import { getPosition } from "../utils/get-position/get-position";
import { isMarkFilled } from "./is-mark-filled";
import useStyles from "./Marks.styles";

export type MarksStylesNames = Selectors<typeof useStyles>;

export interface MarksProps extends DefaultProps<MarksStylesNames> {
  marks: { value: number; label?: JSXElement }[];
  size: MantineNumberSize;
  color: MantineColor;
  min: number;
  max: number;
  value: number;
  onChange(value: number): void;
  offset?: number;
  disabled: boolean;
  inverted?: boolean;
}

export function Marks(props: MarksProps) {
  const { classes, cx } = useStyles(
    { size: props.size, color: props.color, disabled: props.disabled },
    {
      classNames: props.classNames,
      styles: props.styles,
      unstyled: props.unstyled,
      name: "Slider",
    }
  );

  return (
    <div>
      <For each={props.marks}>
        {(mark) => (
          <Box
            className={classes.markWrapper}
            sx={{
              left: `${getPosition({
                value: mark.value,
                min: props.min,
                max: props.max,
              })}%`,
            }}
          >
            <div
              class={cx(classes.mark, {
                [classes.markFilled]: isMarkFilled({
                  mark,
                  value: props.value,
                  offset: props.offset,
                  inverted: props.inverted,
                }),
              })}
            />
            <Show when={mark.label}>
              <div
                class={classes.markLabel}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  props.onChange(mark.value);
                }}
                onTouchStart={(event) => {
                  event.stopPropagation();
                  props.onChange(mark.value);
                }}
              >
                {mark.label}
              </div>
            </Show>
          </Box>
        )}
      </For>
    </div>
  );
}

Marks.displayName = "@mantine/core/SliderMarks";
