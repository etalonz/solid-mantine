import { useMove, clampUseMovePosition, UseMovePosition } from "hooks";
import { DefaultProps, MantineSize, Selectors } from "styles";
import { Box } from "../../Box";
import { Thumb, ThumbStylesNames } from "../Thumb/Thumb";
import useStyles from "./ColorSlider.styles";
import {
  ComponentProps,
  createEffect,
  createSignal,
  For,
  JSX,
  on,
  splitProps,
} from "solid-js";
import { mergeRefs } from "@solid-primitives/refs";

export type ColorSliderStylesNames =
  | Exclude<Selectors<typeof useStyles>, "sliderThumb">
  | ThumbStylesNames;

export interface BaseColorSliderProps
  extends DefaultProps<ColorSliderStylesNames>,
    Omit<ComponentProps<"div">, "value" | "onChange"> {
  value: number;
  onChange(value: number): void;
  onChangeEnd(value: number): void;
  size?: MantineSize;
  focusable?: boolean;
  __staticSelector?: string;
}

export interface ColorSliderProps extends BaseColorSliderProps {
  maxValue: number;
  overlays: JSX.CSSProperties[];
  round: boolean;
  thumbColor?: string;
}

export const ColorSlider = (props: ColorSliderProps) => {
  // size = md, thumbColor = transparent, __staticSelector = ColorSlider, focusable = true
  const [local, others] = splitProps(props, [
    "ref",
    "value",
    "onChange",
    "onChangeEnd",
    "maxValue",
    "round",
    "size",
    "thumbColor",
    "__staticSelector",
    "focusable",
    "overlays",
    "classNames",
    "styles",
    "className",
    "unstyled",
  ]);

  const { classes, cx } = useStyles(
    { size: local.size || "md" },
    {
      classNames: local.classNames,
      styles: local.styles,
      name: local.__staticSelector || "ColorSlider",
      unstyled: local.unstyled,
    }
  );
  const [position, setPosition] = createSignal({
    y: 0,
    x: local.value / local.maxValue,
  });
  let positionRef = position();
  const getChangeValue = (val: number) =>
    local.round ? Math.round(val * local.maxValue) : val * local.maxValue;
  const { setRef } = useMove(
    ({ x, y }) => {
      positionRef = { x, y };
      local.onChange(getChangeValue(x));
    },
    {
      onScrubEnd: () => {
        const { x } = positionRef;
        local.onChangeEnd(getChangeValue(x));
      },
    }
  );

  createEffect(
    on(
      () => local.value,
      () => {
        setPosition({ y: 0, x: local.value / local.maxValue });
      },
      { defer: true }
    )
  );

  const handleArrow = (event: KeyboardEvent, pos: UseMovePosition) => {
    event.preventDefault();
    const _position = clampUseMovePosition(pos);
    local.onChange(getChangeValue(_position.x));
    local.onChangeEnd(getChangeValue(_position.x));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowRight": {
        handleArrow(event, { x: position().x + 0.05, y: position().y });
        break;
      }

      case "ArrowLeft": {
        handleArrow(event, { x: position().x - 0.05, y: position().y });
        break;
      }
    }
  };

  return (
    <Box
      {...others}
      ref={mergeRefs(setRef, local.ref)}
      className={cx(classes.slider, local.className)}
      role="slider"
      aria-valuenow={local.value}
      aria-valuemax={local.maxValue}
      aria-valuemin={0}
      tabIndex={local.focusable === undefined || local.focusable ? 0 : -1}
      onKeyDown={handleKeyDown}
    >
      <For each={local.overlays}>
        {(item) => <div class={classes.sliderOverlay} style={item} />}
      </For>

      <Thumb
        __staticSelector={local.__staticSelector || "ColorSlider"}
        classNames={local.classNames}
        styles={local.styles}
        position={position()}
        style={{
          top: "1px",
          "background-color": local.thumbColor || "transparent",
        }}
        className={classes.sliderThumb}
        size={local.size || "md"}
      />
    </Box>
  );
};

ColorSlider.displayName = "@mantine/core/ColorSlider";
