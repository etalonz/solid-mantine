import { useMove, useUncontrolled, clamp } from "hooks";
import {
  Component,
  DefaultProps,
  MantineColor,
  MantineNumberSize,
  useComponentDefaultProps,
  useMantineTheme,
} from "styles";
import { MantineTransition } from "../../Transition";
import { getPosition } from "../utils/get-position/get-position";
import { getChangeValue } from "../utils/get-change-value/get-change-value";
import { Thumb, ThumbStylesNames } from "../Thumb/Thumb";
import { Track, TrackStylesNames } from "../Track/Track";
import { MarksStylesNames } from "../Marks/Marks";
import { SliderRoot, SliderRootStylesNames } from "../SliderRoot/SliderRoot";
import {
  ComponentProps,
  createMemo,
  createSignal,
  JSXElement,
  splitProps,
} from "solid-js";
import { mergeRefs } from "@solid-primitives/refs";

export type SliderStylesNames =
  | SliderRootStylesNames
  | ThumbStylesNames
  | TrackStylesNames
  | MarksStylesNames;

export interface SliderProps
  extends DefaultProps<SliderStylesNames>,
    Omit<ComponentProps<"div">, "value" | "onChange"> {
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

  /** Number by which value will be incremented/decremented with thumb drag and arrows */
  step?: number;

  /** Amount of digits after the decimal point */
  precision?: number;

  /** Current value for controlled slider */
  value?: number;

  /** Default value for uncontrolled slider */
  defaultValue?: number;

  /** Called each time value changes */
  onChange?(value: number): void;

  /** Called when user stops dragging slider or changes value with arrows */
  onChangeEnd?(value: number): void;

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

  /** Thumb aria-label */
  thumbLabel?: string;

  /** If true slider label will appear on hover */
  showLabelOnHover?: boolean;

  /** Thumb children, can be used to add icon */
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

const defaultProps: Partial<SliderProps> = {
  size: "md",
  radius: "xl",
  min: 0,
  max: 100,
  step: 1,
  marks: [],
  label: (f) => f,
  labelTransition: "skew-down",
  labelTransitionDuration: 0,
  labelAlwaysOn: false,
  thumbLabel: "",
  showLabelOnHover: true,
  disabled: false,
  scale: (v) => v,
};

export const Slider: Component<SliderProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Slider", defaultProps, props),
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
      "thumbLabel",
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

  const [hovered, setHovered] = createSignal(false);

  const [_value, setValue] = useUncontrolled({
    value: () =>
      typeof local.value === "number"
        ? clamp(local.value, local.min, local.max)
        : local.value,
    defaultValue:
      typeof local.defaultValue === "number"
        ? clamp(local.defaultValue, local.min, local.max)
        : local.defaultValue,
    finalValue: clamp(0, local.min, local.max),
    onChange: local.onChange,
  });

  let valueRef = _value();
  let thumb: HTMLDivElement;

  const position = createMemo(() =>
    getPosition({ value: _value(), min: local.min, max: local.max })
  );

  const scaledValue = createMemo(() => local.scale(_value()));
  const _label = createMemo(() =>
    typeof local.label === "function" ? local.label(scaledValue()) : local.label
  );

  const handleChange = ({ x }: { x: number }) => {
    if (!local.disabled) {
      const nextValue = getChangeValue({
        value: x,
        min: local.min,
        max: local.max,
        step: local.step,
        precision: local.precision,
      });
      setValue(nextValue);
      valueRef = nextValue;
    }
  };

  const {
    ref: container,
    active,
    setRef,
  } = useMove(
    handleChange,
    { onScrubEnd: () => local.onChangeEnd?.(valueRef) },
    theme.dir
  );

  const handleThumbMouseDown = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
  };

  const handleTrackKeydownCapture = (event: KeyboardEvent) => {
    if (!local.disabled) {
      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          thumb.focus();
          const nextValue = Math.min(
            Math.max(_value() + local.step, local.min),
            local.max
          );
          local.onChangeEnd?.(nextValue);
          setValue(nextValue);
          break;
        }

        case "ArrowRight": {
          event.preventDefault();
          thumb.focus();
          const nextValue = Math.min(
            Math.max(
              theme.dir === "rtl"
                ? _value() - local.step
                : _value() + local.step,
              local.min
            ),
            local.max
          );
          local.onChangeEnd?.(nextValue);
          setValue(nextValue);
          break;
        }

        case "ArrowDown": {
          event.preventDefault();
          thumb.focus();
          const nextValue = Math.min(
            Math.max(_value() - local.step, local.min),
            local.max
          );
          local.onChangeEnd?.(nextValue);
          setValue(nextValue);
          break;
        }

        case "ArrowLeft": {
          event.preventDefault();
          thumb.focus();
          const nextValue = Math.min(
            Math.max(
              theme.dir === "rtl"
                ? _value() + local.step
                : _value() - local.step,
              local.min
            ),
            local.max
          );
          local.onChangeEnd?.(nextValue);
          setValue(nextValue);
          break;
        }

        case "Home": {
          event.preventDefault();
          thumb.focus();
          local.onChangeEnd?.(local.min);
          setValue(local.min);
          break;
        }

        case "End": {
          event.preventDefault();
          thumb.focus();
          local.onChangeEnd?.(local.max);
          setValue(local.max);
          break;
        }

        default: {
          break;
        }
      }
    }
  };

  return (
    <SliderRoot
      {...others}
      size={local.size}
      ref={mergeRefs(setRef, local.ref)}
      onKeyDown={handleTrackKeydownCapture}
      onMouseDown={() => container?.focus()}
      classNames={local.classNames}
      styles={local.styles}
      disabled={local.disabled}
      unstyled={local.unstyled}
    >
      <Track
        inverted={local.inverted}
        offset={0}
        filled={position()}
        marks={local.marks}
        size={local.size}
        radius={local.radius}
        color={local.color}
        min={local.min}
        max={local.max}
        value={scaledValue()}
        onChange={setValue}
        onMouseEnter={
          local.showLabelOnHover ? () => setHovered(true) : undefined
        }
        onMouseLeave={
          local.showLabelOnHover ? () => setHovered(false) : undefined
        }
        classNames={local.classNames}
        styles={local.styles}
        disabled={local.disabled}
        unstyled={local.unstyled}
      >
        <Thumb
          max={local.max}
          min={local.min}
          value={scaledValue()}
          position={position()}
          dragging={active()}
          color={local.color}
          size={local.size}
          label={_label()}
          ref={thumb}
          onMouseDown={handleThumbMouseDown}
          labelTransition={local.labelTransition}
          labelTransitionDuration={local.labelTransitionDuration}
          labelTransitionTimingFunction={local.labelTransitionTimingFunction}
          labelAlwaysOn={local.labelAlwaysOn}
          classNames={local.classNames}
          styles={local.styles}
          thumbLabel={local.thumbLabel}
          showLabelOnHover={local.showLabelOnHover && hovered()}
          disabled={local.disabled}
          unstyled={local.unstyled}
          thumbSize={local.thumbSize}
        >
          {local.thumbChildren}
        </Thumb>
      </Track>

      <input type="hidden" name={local.name} value={scaledValue()} />
    </SliderRoot>
  );
};

Slider.displayName = "@mantine/core/Slider";
