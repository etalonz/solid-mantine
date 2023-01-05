import { useUncontrolled } from "hooks";
import {
  DefaultProps,
  getDefaultZIndex,
  MantineShadow,
  useMantineTheme,
} from "styles";
import {
  InputWrapperBaseProps,
  InputWrapperStylesNames,
  Input,
  InputSharedProps,
  InputStylesNames,
  useInputProps,
} from "../Input";
import { ColorSwatch } from "../ColorSwatch";
import { Popover, PopoverStylesNames } from "../Popover";
import { MantineTransition } from "../Transition";
import {
  ColorPicker,
  ColorPickerBaseProps,
  ColorPickerStylesNames,
} from "../ColorPicker/ColorPicker";
import {
  convertHsvaTo,
  isColorValid,
  parseColor,
} from "../ColorPicker/converters";
import {
  ComponentProps,
  createEffect,
  createSignal,
  on,
  splitProps,
} from "solid-js";
import { Box } from "../Box";

export type ColorInputStylesNames =
  | InputWrapperStylesNames
  | InputStylesNames
  | ColorPickerStylesNames
  | PopoverStylesNames;

export interface ColorInputProps
  extends InputWrapperBaseProps,
    InputSharedProps,
    ColorPickerBaseProps,
    DefaultProps<ColorInputStylesNames>,
    Omit<
      ComponentProps<"input">,
      "size" | "onChange" | "defaultValue" | "value"
    > {
  /** Disallow free input */
  disallowInput?: boolean;

  /** call onChange with last valid value onBlur */
  fixOnBlur?: boolean;

  /** Dropdown element z-index */
  dropdownZIndex?: number;

  /** Display swatch with color preview on the left side of input */
  withPreview?: boolean;

  /** Dropdown transition name or object */
  transition?: MantineTransition;

  /** Dropdown appear/disappear transition duration in ms */
  transitionDuration?: number;

  /** Dropdown transition timing function, defaults to theme.transitionTimingFunction */
  transitionTimingFunction?: string;

  /** Whether to render the dropdown in a Portal */
  withinPortal?: boolean;

  /** Dropdown box-shadow, key of theme.shadows */
  shadow?: MantineShadow;
}

const SWATCH_SIZES = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
};

const defaultProps: Partial<ColorInputProps> = {
  size: "sm",
  format: "hex",
  fixOnBlur: true,
  withPreview: true,
  swatchesPerRow: 10,
  withPicker: true,
  transition: "pop-top-left",
  dropdownZIndex: getDefaultZIndex("popover"),
  transitionDuration: 0,
  withinPortal: true,
  shadow: "md",
};

export const ColorInput = (props: ColorInputProps) => {
  const [local, others] = splitProps(
    useInputProps("ColorInput", defaultProps, props),
    [
      "wrapperProps",
      "inputProps",
      "format",
      "onChange",
      "onChangeEnd",
      "onFocus",
      "onBlur",
      "value",
      "defaultValue",
      "disallowInput",
      "fixOnBlur",
      "withPreview",
      "swatchesPerRow",
      "withPicker",
      "icon",
      "transition",
      "dropdownZIndex",
      "transitionDuration",
      "transitionTimingFunction",
      "withinPortal",
      "swatches",
      "shadow",
      "classNames",
      "styles",
      "unstyled",
      "readOnly",
    ]
  );

  const theme = useMantineTheme();
  const [dropdownOpened, setDropdownOpened] = createSignal(false);
  const [lastValidValue, setLastValidValue] = createSignal("");
  const [_value, setValue] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: "",
    onChange: local.onChange,
  });

  const handleInputFocus = (event: FocusEvent) => {
    typeof local.onFocus === "function" && local.onFocus(event);
    setDropdownOpened(true);
  };

  const handleInputBlur = (event: FocusEvent) => {
    typeof local.onBlur === "function" && local.onBlur(event);
    setDropdownOpened(false);
    local.fixOnBlur && setValue(lastValidValue());
  };

  createEffect(() => {
    if (isColorValid(_value()) || _value().trim() === "") {
      setLastValidValue(_value());
    }
  });

  createEffect(
    on(
      () => local.format,
      (format) => {
        if (isColorValid(_value())) {
          setValue(convertHsvaTo(format, parseColor(_value())));
        }
      }
    )
  );

  return (
    <Input.Wrapper {...local.wrapperProps} __staticSelector="ColorInput">
      <Popover
        __staticSelector="ColorInput"
        position="bottom-start"
        offset={5}
        zIndex={local.dropdownZIndex}
        withinPortal={local.withinPortal}
        transitionDuration={local.transitionDuration}
        transition={local.transition}
        opened={dropdownOpened()}
        shadow={local.shadow}
        classNames={local.classNames}
        styles={local.styles}
        unstyled={local.unstyled}
        disabled={
          local.readOnly ||
          (local.withPicker === false &&
            (!Array.isArray(local.swatches) || local.swatches.length === 0))
        }
      >
        <Popover.Target>
          <Box>
            <Input<"input">
              autocomplete="nope"
              {...others}
              {...local.inputProps}
              __staticSelector="ColorInput"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              spellcheck={false}
              value={_value()}
              onChange={(event) => {
                const inputValue = event.currentTarget.value;
                setValue(inputValue);
                if (isColorValid(inputValue)) {
                  local.onChangeEnd?.(
                    convertHsvaTo(local.format, parseColor(inputValue))
                  );
                }
              }}
              icon={
                local.icon ||
                (local.withPreview ? (
                  <ColorSwatch
                    color={isColorValid(_value()) ? _value() : "#fff"}
                    size={theme.fn.size({
                      size: local.inputProps.size,
                      sizes: SWATCH_SIZES,
                    })}
                  />
                ) : null)
              }
              readOnly={local.disallowInput || local.readOnly}
              sx={{ cursor: local.disallowInput ? "pointer" : undefined }}
              unstyled={local.unstyled}
              classNames={local.classNames}
              styles={local.styles}
            />
          </Box>
        </Popover.Target>

        <Popover.Dropdown
          onMouseDown={(event) => event.preventDefault()}
          p={local.inputProps.size}
        >
          <ColorPicker
            __staticSelector="ColorInput"
            value={_value()}
            onChange={setValue}
            onChangeEnd={local.onChangeEnd}
            format={local.format}
            swatches={local.swatches}
            swatchesPerRow={local.swatchesPerRow}
            withPicker={local.withPicker}
            size={local.inputProps.size}
            focusable={false}
            unstyled={local.unstyled}
            styles={local.styles}
            classNames={local.classNames}
          />
        </Popover.Dropdown>
      </Popover>
    </Input.Wrapper>
  );
};

ColorInput.displayName = "@mantine/core/ColorInput";
