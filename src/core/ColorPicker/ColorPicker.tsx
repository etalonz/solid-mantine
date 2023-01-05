import { useUncontrolled } from "hooks";
import {
  DefaultProps,
  MantineSize,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import { ColorSwatch } from "../ColorSwatch/ColorSwatch";
import { convertHsvaTo, isColorValid, parseColor } from "./converters";
import { ColorSliderStylesNames } from "./ColorSlider/ColorSlider";
import { HueSlider } from "./HueSlider/HueSlider";
import { AlphaSlider } from "./AlphaSlider/AlphaSlider";
import { Saturation, SaturationStylesNames } from "./Saturation/Saturation";
import { Swatches, SwatchesStylesNames } from "./Swatches/Swatches";
import { ThumbStylesNames } from "./Thumb/Thumb";
import { HsvaColor } from "./types";
import useStyles from "./ColorPicker.styles";
import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  on,
  Show,
  splitProps,
} from "solid-js";

export type ColorPickerStylesNames =
  | Selectors<typeof useStyles>
  | ColorSliderStylesNames
  | SwatchesStylesNames
  | SaturationStylesNames
  | ThumbStylesNames;

export interface ColorPickerBaseProps {
  /** Controlled component value */
  value?: string;

  /** Uncontrolled component default value */
  defaultValue?: string;

  /** Called when color changes */
  onChange?(color: string): void;

  /** Called when user stops dragging thumb or changes value with arrows */
  onChangeEnd?(color: string): void;

  /** Color format */
  format?: "hex" | "rgba" | "rgb" | "hsl" | "hsla";

  /** Set to false to display swatches only */
  withPicker?: boolean;

  /** Predefined colors */
  swatches?: string[];

  /** Number of swatches displayed in one row */
  swatchesPerRow?: number;

  /** Predefined component size */
  size?: MantineSize;
}

export interface ColorPickerProps
  extends DefaultProps<ColorPickerStylesNames>,
    ColorPickerBaseProps,
    Omit<ComponentProps<"div">, "onChange" | "value" | "defaultValue"> {
  /** Force picker to take 100% width of its container */
  fullWidth?: boolean;

  /** Should interactive elements be focusable */
  focusable?: boolean;

  /** Static selector base */
  __staticSelector?: string;

  /** Saturation slider aria-label */
  saturationLabel?: string;

  /** Hue slider aria-label */
  hueLabel?: string;

  /** Alpha slider aria-label */
  alphaLabel?: string;
}

const SWATCH_SIZES = {
  xs: 26,
  sm: 34,
  md: 42,
  lg: 50,
  xl: 54,
};

const defaultProps: Partial<ColorPickerProps> = {
  swatchesPerRow: 10,
  size: "sm",
  withPicker: true,
  focusable: true,
  __staticSelector: "ColorPicker",
};

export const ColorPicker = (props: ColorPickerProps) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("ColorPicker", defaultProps, props),
    [
      "value",
      "defaultValue",
      "onChange",
      "onChangeEnd",
      "format",
      "swatches",
      "swatchesPerRow",
      "size",
      "withPicker",
      "fullWidth",
      "focusable",
      "__staticSelector",
      "saturationLabel",
      "hueLabel",
      "alphaLabel",
      "className",
      "styles",
      "classNames",
      "unstyled",
    ]
  );

  const { classes, cx, theme } = useStyles(
    { size: local.size, fullWidth: local.fullWidth },
    {
      classNames: local.classNames,
      styles: local.styles,
      name: local.__staticSelector,
      unstyled: local.unstyled,
    }
  );

  let formatRef = local.format;
  let valueRef: string = null;
  let updateRef = true;

  const withAlpha = createMemo(
    () => local.format === "rgba" || local.format === "hsla"
  );

  const [_value, setValue] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: "#FFFFFF",
    onChange: local.onChange,
  });

  const [parsed, setParsed] = createSignal(parseColor(_value()));

  const handleChange = (color: Partial<HsvaColor>) => {
    updateRef = false;
    setParsed((current) => {
      const next = { ...current, ...color };
      valueRef = convertHsvaTo(formatRef, next);
      return next;
    });

    setValue(valueRef);

    // Does not work any other way
    setTimeout(() => {
      updateRef = true;
    }, 0);
  };

  createEffect(
    on(
      () => local.value,
      (value) => {
        if (isColorValid(value) && updateRef) {
          setParsed(parseColor(value));
          updateRef = true;
        }
      },
      { defer: true }
    )
  );

  createEffect(
    on(
      () => local.format,
      (format) => {
        formatRef = format;
        setValue(convertHsvaTo(format, parsed()));
      },
      { defer: true }
    )
  );

  return (
    <Box className={cx(classes.wrapper, local.className)} {...others}>
      <Show when={local.withPicker}>
        <Saturation
          value={parsed()}
          onChange={handleChange}
          onChangeEnd={({ s, v }) =>
            local.onChangeEnd?.(convertHsvaTo(formatRef, { ...parsed(), s, v }))
          }
          color={_value()}
          styles={local.styles}
          classNames={local.classNames}
          size={local.size}
          focusable={local.focusable}
          saturationLabel={local.saturationLabel}
          __staticSelector={local.__staticSelector}
        />

        <div class={classes.body}>
          <div class={classes.sliders}>
            <HueSlider
              value={parsed().h}
              onChange={(h) => handleChange({ h })}
              onChangeEnd={(h) =>
                local.onChangeEnd?.(
                  convertHsvaTo(formatRef, { ...parsed(), h })
                )
              }
              size={local.size}
              styles={local.styles}
              classNames={local.classNames}
              focusable={local.focusable}
              aria-label={local.hueLabel}
              __staticSelector={local.__staticSelector}
            />

            <Show when={withAlpha()}>
              <AlphaSlider
                value={parsed().a}
                onChange={(a) => handleChange({ a })}
                onChangeEnd={(a) => {
                  local.onChangeEnd?.(
                    convertHsvaTo(formatRef, { ...parsed(), a })
                  );
                }}
                size={local.size}
                color={convertHsvaTo("hex", parsed())}
                style={{ "margin-top": "6px" }}
                styles={local.styles}
                classNames={local.classNames}
                focusable={local.focusable}
                aria-label={local.alphaLabel}
                __staticSelector={local.__staticSelector}
              />
            </Show>
          </div>

          <Show when={withAlpha()}>
            <ColorSwatch
              color={_value()}
              radius="sm"
              size={theme.fn.size({ size: local.size, sizes: SWATCH_SIZES })}
              className={classes.preview}
            />
          </Show>
        </div>
      </Show>

      <Show when={Array.isArray(local.swatches)}>
        <Swatches
          data={local.swatches}
          style={{ "margin-top": "5px" }}
          swatchesPerRow={local.swatchesPerRow}
          focusable={local.focusable}
          classNames={local.classNames}
          styles={local.styles}
          __staticSelector={local.__staticSelector}
          setValue={setValue}
          onChangeEnd={(color) => {
            local.onChangeEnd?.(convertHsvaTo(local.format, parseColor(color)));
          }}
        />
      </Show>
    </Box>
  );
};

ColorPicker.displayName = "@mantine/core/ColorPicker";
