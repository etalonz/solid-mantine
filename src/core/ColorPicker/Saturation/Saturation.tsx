import { useMove, clampUseMovePosition, UseMovePosition } from "hooks";
import { DefaultProps, MantineSize, Selectors } from "styles";
import { HsvaColor } from "../types";
import { Thumb, ThumbStylesNames } from "../Thumb/Thumb";
import useStyles from "./Saturation.styles";
import { convertHsvaTo } from "../converters";
import { createEffect, createSignal } from "solid-js";

export type SaturationStylesNames =
  | Exclude<
      Selectors<typeof useStyles>,
      "saturationOverlay" | "saturationThumb"
    >
  | ThumbStylesNames;

interface SaturationProps extends DefaultProps<SaturationStylesNames> {
  value: HsvaColor;
  onChange(color: Partial<HsvaColor>): void;
  onChangeEnd(color: Partial<HsvaColor>): void;
  saturationLabel?: string;
  size: MantineSize;
  color: string;
  focusable?: boolean;
  __staticSelector?: string;
}

export function Saturation(props: SaturationProps) {
  const { classes } = useStyles(
    { size: props.size },
    {
      classNames: props.classNames,
      styles: props.styles,
      name: props.__staticSelector,
      unstyled: props.unstyled,
    }
  );
  const [position, setPosition] = createSignal({
    x: props.value.s / 100,
    y: 1 - props.value.v / 100,
  });
  let positionRef = position();

  const { setRef } = useMove(
    ({ x, y }) => {
      positionRef = { x, y };
      props.onChange({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
    },
    {
      onScrubEnd: () => {
        const { x, y } = positionRef;
        props.onChangeEnd({
          s: Math.round(x * 100),
          v: Math.round((1 - y) * 100),
        });
      },
    }
  );

  createEffect(() => {
    setPosition({ x: props.value.s / 100, y: 1 - props.value.v / 100 });
  });

  const handleArrow = (event: KeyboardEvent, pos: UseMovePosition) => {
    event.preventDefault();
    const _position = clampUseMovePosition(pos);
    props.onChange({
      s: Math.round(_position.x * 100),
      v: Math.round((1 - _position.y) * 100),
    });
    props.onChangeEnd({
      s: Math.round(_position.x * 100),
      v: Math.round((1 - _position.y) * 100),
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp": {
        handleArrow(event, { y: position().y - 0.05, x: position().x });
        break;
      }

      case "ArrowDown": {
        handleArrow(event, { y: position().y + 0.05, x: position().x });
        break;
      }

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
    <div
      class={classes.saturation}
      ref={setRef}
      role="slider"
      aria-label={props.saturationLabel}
      aria-valuenow={position().x}
      aria-valuetext={convertHsvaTo("rgba", props.value)}
      tabIndex={props.focusable ? 0 : -1}
      onKeyDown={handleKeyDown}
    >
      <div
        class={classes.saturationOverlay}
        style={{ "background-color": `hsl(${props.value.h}, 100%, 50%)` }}
      />

      <div
        class={classes.saturationOverlay}
        style={{
          "background-image": "linear-gradient(90deg, #fff, transparent)",
        }}
      />

      <div
        class={classes.saturationOverlay}
        style={{
          "background-image": "linear-gradient(0deg, #000, transparent)",
        }}
      />

      <Thumb
        __staticSelector={props.__staticSelector}
        classNames={props.classNames}
        styles={props.styles}
        position={position()}
        className={classes.saturationThumb}
        style={{ "background-color": props.color }}
        size={props.size}
      />
    </div>
  );
}

Saturation.displayName = "@mantine/core/Saturation";
