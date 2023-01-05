import { useMove, useUncontrolled } from "hooks";
import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  useMantineTheme,
  useComponentDefaultProps,
  Component,
} from "styles";
import { MantineTransition } from "../../Transition";
import { getClientPosition } from "../utils/get-client-position/get-client-position";
import { getPosition } from "../utils/get-position/get-position";
import { getChangeValue } from "../utils/get-change-value/get-change-value";
import { Thumb, ThumbStylesNames } from "../Thumb/Thumb";
import { Track, TrackStylesNames } from "../Track/Track";
import { MarksStylesNames } from "../Marks/Marks";
import { SliderRoot, SliderRootStylesNames } from "../SliderRoot/SliderRoot";
import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSXElement,
  splitProps,
} from "solid-js";
import { mergeRefs } from "@solid-primitives/refs";

export type RangeSliderStylesNames =
  | SliderRootStylesNames
  | ThumbStylesNames
  | TrackStylesNames
  | MarksStylesNames;

type Value = [number, number];

export interface RangeSliderProps
  extends DefaultProps<RangeSliderStylesNames>,
    Omit<ComponentProps<"div">, "value" | "onChange" | "defaultValue"> {
  /** Color from theme.colors */
  color?: MantineColor;

  /** Track border-radius from theme or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Predefined track and thumb size, number to set sizes in px */
  size?: MantineNumberSize;

  /** Minimal possible value */
  min?: number;

  /** Maximum possible value */
  max?: number;

  /** Minimal range interval */
  minRange?: number;

  /** Number by which value will be incremented/decremented with thumb drag and arrows */
  step?: number;

  /** Amount of digits after the decimal point */
  precision?: number;

  /** Current value for controlled slider */
  value?: Value;

  /** Default value for uncontrolled slider */
  defaultValue?: Value;

  /** Called each time value changes */
  onChange?(value: Value): void;

  /** Called when user stops dragging slider or changes value with arrows */
  onChangeEnd?(value: Value): void;

  /** Hidden input name, use with uncontrolled variant */
  name?: string;

  /** Marks which will be placed on the track */
  marks?: { value: number; label?: JSXElement }[];

  /** Function to generate label or any react node to render instead, set to null to disable label */
  label?: JSXElement | ((value: number) => JSXElement);

  /** Label appear/disappear transition */
  labelTransition?: MantineTransition;

  /** Label appear/disappear transition duration in ms */
  labelTransitionDuration?: number;

  /** Label appear/disappear transition timing function, defaults to theme.transitionRimingFunction */
  labelTransitionTimingFunction?: string;

  /** If true label will be not be hidden when user stops dragging */
  labelAlwaysOn?: boolean;

  /** First thumb aria-label */
  thumbFromLabel?: string;

  /** Second thumb aria-label */
  thumbToLabel?: string;

  /**If true slider label will appear on hover */
  showLabelOnHover?: boolean;

  /** Thumbs children, can be used to add icons */
  thumbChildren?: JSXElement;

  /** Disables slider */
  disabled?: boolean;

  /** Thumb width and height in px */
  thumbSize?: number;

  /** A transformation function, to change the scale of the slider */
  scale?: (value: number) => number;

  /** Allows the track to be inverted */
  inverted?: boolean;
}

const defaultProps: Partial<RangeSliderProps> = {
  size: "md",
  radius: "xl",
  min: 0,
  max: 100,
  minRange: 10,
  step: 1,
  marks: [],
  label: (f) => f,
  labelTransition: "skew-down",
  labelTransitionDuration: 0,
  labelAlwaysOn: false,
  thumbFromLabel: "",
  thumbToLabel: "",
  showLabelOnHover: true,
  disabled: false,
  scale: (v) => v,
};

export const RangeSlider: Component<RangeSliderProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("RangeSlider", defaultProps, props),
    [
      "ref",
      "classNames",
      "styles",
      "color",
      "value",
      "onChange",
      "onChangeEnd",
      "size",
      "radius",
      "min",
      "max",
      "minRange",
      "step",
      "precision",
      "defaultValue",
      "name",
      "marks",
      "label",
      "labelTransition",
      "labelTransitionDuration",
      "labelTransitionTimingFunction",
      "labelAlwaysOn",
      "thumbFromLabel",
      "thumbToLabel",
      "showLabelOnHover",
      "thumbChildren",
      "disabled",
      "unstyled",
      "thumbSize",
      "scale",
      "inverted",
    ]
  );

  const theme = useMantineTheme();

  const [focused, setFocused] = createSignal(-1);
  const [hovered, setHovered] = createSignal(false);

  const [_value, setValue] = useUncontrolled<Value>({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: [local.min, local.max],
    onChange: local.onChange,
  });

  let valueRef = _value();
  let thumbs: HTMLDivElement[] = [];
  let thumbIndex: number = undefined;

  const positions = createMemo(() => [
    getPosition({ value: _value[0], min: local.min, max: local.max }),
    getPosition({ value: _value[1], min: local.min, max: local.max }),
  ]);

  const _setValue = (val: Value) => {
    setValue(val);
    valueRef = val;
  };

  createEffect(() => {
    if (Array.isArray(local.value)) {
      valueRef = local.value;
    }
  });

  const setRangedValue = (
    val: number,
    index: number,
    triggerChangeEnd: boolean
  ) => {
    const clone: Value = [...valueRef];
    clone[index] = val;

    if (index === 0) {
      if (val > clone[1] - (local.minRange - 0.000000001)) {
        clone[1] = Math.min(val + local.minRange, local.max);
      }

      if (val > (local.max - (local.minRange - 0.000000001) || local.min)) {
        clone[index] = valueRef[index];
      }
    }

    if (index === 1) {
      if (val < clone[0] + local.minRange) {
        clone[0] = Math.max(val - local.minRange, local.min);
      }

      if (val < clone[0] + local.minRange) {
        clone[index] = valueRef[index];
      }
    }

    _setValue(clone);

    if (triggerChangeEnd) {
      local.onChangeEnd?.(valueRef);
    }
  };

  const handleChange = (val: number) => {
    if (!local.disabled) {
      const nextValue = getChangeValue({
        value: val,
        min: local.min,
        max: local.max,
        step: local.step,
        precision: local.precision,
      });
      setRangedValue(nextValue, thumbIndex, false);
    }
  };

  const {
    ref: container,
    active,
    setRef,
  } = useMove(
    ({ x }) => handleChange(x),
    { onScrubEnd: () => local.onChangeEnd?.(valueRef) },
    theme.dir
  );

  function handleThumbMouseDown(event: MouseEvent | TouchEvent, index: number) {
    event.stopPropagation();
    thumbIndex = index;
  }

  const handleTrackMouseDownCapture = (event: MouseEvent | TouchEvent) => {
    container.focus();
    const rect = container.getBoundingClientRect();
    const changePosition = getClientPosition(event);
    const changeValue = getChangeValue({
      value: changePosition - rect.left,
      max: local.max,
      min: local.min,
      step: local.step,
      containerWidth: rect.width,
    });

    const nearestHandle =
      Math.abs(_value[0] - changeValue) > Math.abs(_value[1] - changeValue)
        ? 1
        : 0;
    const _nearestHandle =
      theme.dir === "ltr" ? nearestHandle : nearestHandle === 1 ? 0 : 1;

    thumbIndex = _nearestHandle;
  };

  const getFocusedThumbIndex = () => {
    if (focused() !== 1 && focused() !== 0) {
      setFocused(0);
      return 0;
    }

    return focused();
  };

  const handleTrackKeydownCapture = (event: KeyboardEvent) => {
    if (!local.disabled) {
      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs[focusedIndex].focus();
          setRangedValue(
            Math.min(
              Math.max(valueRef[focusedIndex] + local.step, local.min),
              local.max
            ),
            focusedIndex,
            true
          );
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs[focusedIndex].focus();
          setRangedValue(
            Math.min(
              Math.max(
                theme.dir === "rtl"
                  ? valueRef[focusedIndex] - local.step
                  : valueRef[focusedIndex] + local.step,
                local.min
              ),
              local.max
            ),
            focusedIndex,
            true
          );
          break;
        }

        case "ArrowDown": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs[focusedIndex].focus();
          setRangedValue(
            Math.min(
              Math.max(valueRef[focusedIndex] - local.step, local.min),
              local.max
            ),
            focusedIndex,
            true
          );
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs[focusedIndex].focus();
          setRangedValue(
            Math.min(
              Math.max(
                theme.dir === "rtl"
                  ? valueRef[focusedIndex] + local.step
                  : valueRef[focusedIndex] - local.step,
                local.min
              ),
              local.max
            ),
            focusedIndex,
            true
          );
          break;
        }

        default: {
          break;
        }
      }
    }
  };

  const sharedThumbProps = createMemo(() => ({
    max: local.max,
    min: local.min,
    color: local.color,
    size: local.size,
    labelTransition: local.labelTransition,
    labelTransitionDuration: local.labelTransitionDuration,
    labelTransitionTimingFunction: local.labelTransitionTimingFunction,
    labelAlwaysOn: local.labelAlwaysOn,
    onBlur: () => setFocused(-1),
    classNames: local.classNames,
    styles: local.styles,
  }));

  const hasArrayThumbChildren = createMemo(() =>
    Array.isArray(local.thumbChildren)
  );

  return (
    <SliderRoot
      {...others}
      size={local.size}
      ref={mergeRefs(setRef, local.ref)}
      onTouchStart={handleTrackMouseDownCapture}
      onTouchEnd={() => {
        thumbIndex = -1;
      }}
      onMouseDown={handleTrackMouseDownCapture}
      onMouseUp={() => {
        thumbIndex = -1;
      }}
      onKeyDown={handleTrackKeydownCapture}
      styles={local.styles}
      classNames={local.classNames}
      disabled={local.disabled}
      unstyled={local.unstyled}
    >
      <Track
        offset={positions()[0]}
        marksOffset={_value()[0]}
        filled={positions()[1] - positions()[0]}
        marks={local.marks}
        inverted={local.inverted}
        size={local.size}
        radius={local.radius}
        color={local.color}
        min={local.min}
        max={local.max}
        value={_value()[1]}
        styles={local.styles}
        classNames={local.classNames}
        onMouseEnter={
          local.showLabelOnHover ? () => setHovered(true) : undefined
        }
        onMouseLeave={
          local.showLabelOnHover ? () => setHovered(false) : undefined
        }
        onChange={(val) => {
          const nearestValue =
            Math.abs(_value()[0] - val) > Math.abs(_value()[1] - val) ? 1 : 0;
          const clone: Value = [..._value()];
          clone[nearestValue] = val;
          _setValue(clone);
        }}
        disabled={local.disabled}
        unstyled={local.unstyled}
      >
        <Thumb
          {...sharedThumbProps()}
          value={local.scale(_value()[0])}
          position={positions()[0]}
          dragging={active()}
          label={
            typeof local.label === "function"
              ? local.label(local.scale(_value()[0]))
              : local.label
          }
          ref={(node) => {
            thumbs[0] = node;
          }}
          thumbLabel={local.thumbFromLabel}
          onMouseDown={(event) => handleThumbMouseDown(event, 0)}
          onFocus={() => setFocused(0)}
          showLabelOnHover={local.showLabelOnHover && hovered()}
          disabled={local.disabled}
          unstyled={local.unstyled}
          thumbSize={local.thumbSize}
        >
          {hasArrayThumbChildren()
            ? local.thumbChildren[0]
            : local.thumbChildren}
        </Thumb>

        <Thumb
          {...sharedThumbProps()}
          thumbLabel={local.thumbToLabel}
          value={local.scale(_value()[1])}
          position={positions()[1]}
          dragging={active()}
          label={
            typeof local.label === "function"
              ? local.label(local.scale(_value()[1]))
              : local.label
          }
          ref={(node) => {
            thumbs[1] = node;
          }}
          onMouseDown={(event) => handleThumbMouseDown(event, 1)}
          onFocus={() => setFocused(1)}
          showLabelOnHover={local.showLabelOnHover && hovered()}
          disabled={local.disabled}
          unstyled={local.unstyled}
          thumbSize={local.thumbSize}
        >
          {hasArrayThumbChildren()
            ? local.thumbChildren[1]
            : local.thumbChildren}
        </Thumb>
      </Track>

      <input type="hidden" name={`${local.name}_from`} value={_value()[0]} />
      <input type="hidden" name={`${local.name}_to`} value={_value()[1]} />
    </SliderRoot>
  );
};

RangeSlider.displayName = "@mantine/core/RangeSlider";
