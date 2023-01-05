import { useOs, clamp } from "hooks";
import {
  Component,
  DefaultProps,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { TextInput } from "../TextInput";
import { InputStylesNames, InputWrapperStylesNames } from "../Input";
import { getInputMode } from "./get-input-mode/get-input-mode";
import { Chevron } from "./Chevron";
import useStyles, { CONTROL_SIZES } from "./NumberInput.styles";
import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
  Ref,
  splitProps,
  untrack,
} from "solid-js";
import { mergeRefs } from "@solid-primitives/refs";
import { createWritableMemo } from "@solid-primitives/memo";

export type InnerNumberInputStylesNames = Selectors<typeof useStyles>;
export type NumberInputStylesNames =
  | InputStylesNames
  | InputWrapperStylesNames
  | InnerNumberInputStylesNames;

export interface NumberInputHandlers {
  increment(): void;
  decrement(): void;
}

type Formatter = (value: string | undefined) => string;
type Parser = (value: string | undefined) => string | undefined;

export interface NumberInputProps
  extends DefaultProps<NumberInputStylesNames>,
    Omit<
      ComponentProps<typeof TextInput>,
      "onChange" | "value" | "classNames" | "styles" | "type"
    > {
  /** onChange input handler for controlled variant, note that input event is not exposed. It will return undefined if the input is empty, otherwise it'll return a number */
  onChange?(value: number | undefined): void;

  /** Input value for controlled variant */
  value?: number | undefined;

  /** The decimal separator */
  decimalSeparator?: string;

  /** Maximum possible value */
  max?: number;

  /** Minimal possible value */
  min?: number;

  /** First value if no initial value was set and increment/decrement is triggered using controls or up/down arrows */
  startValue?: number;

  /** Number by which value will be incremented/decremented with controls and up/down arrows */
  step?: number;

  /** Delay before stepping the value. Can be a number of milliseconds or a function that receives the current step count and returns the delay in milliseconds. */
  stepHoldInterval?: number | ((stepCount: number) => number);

  /** Initial delay in milliseconds before stepping the value. */
  stepHoldDelay?: number;

  /** Removes increment/decrement controls */
  hideControls?: boolean;

  /** Amount of digits after the decimal point  */
  precision?: number;

  /** Only works if a precision is given, removes the trailing zeros, false by default */
  removeTrailingZeros?: boolean;

  /** Default value for uncontrolled variant only */
  defaultValue?: number | undefined;

  /** Prevent value clamp on blur */
  noClampOnBlur?: boolean;

  /** Get increment/decrement handlers */
  handlersRef?: Ref<NumberInputHandlers | undefined>;

  /** Formats the number into the input */
  formatter?: Formatter;

  /** Parses the value from formatter, should be used with formatter at the same time */
  parser?: Parser;

  /** Input type, defaults to text */
  type?: "text" | "number";
}

const defaultFormatter: Formatter = (value) => value || "";
const defaultParser: Parser = (num) => {
  if (num === "-") {
    return num;
  }

  let tempNum = num;

  if (tempNum[0] === ".") {
    tempNum = `0${num}`;
  }

  const parsedNum = parseFloat(tempNum);

  if (Number.isNaN(parsedNum)) {
    return undefined;
  }

  return num;
};

const CHEVRON_SIZES = {
  xs: 10,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const defaultProps: Partial<NumberInputProps> = {
  step: 1,
  hideControls: false,
  size: "sm",
  precision: 0,
  noClampOnBlur: false,
  removeTrailingZeros: false,
  formatter: defaultFormatter,
  parser: defaultParser,
  type: "text",
};

export const NumberInput: Component<NumberInputProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("NumberInput", defaultProps, props),
    [
      "ref",
      "disabled",
      "value",
      "onChange",
      "decimalSeparator",
      "min",
      "max",
      "startValue",
      "step",
      "stepHoldInterval",
      "stepHoldDelay",
      "onBlur",
      "onFocus",
      "onKeyDown",
      "onKeyUp",
      "hideControls",
      "radius",
      "variant",
      "precision",
      "removeTrailingZeros",
      "defaultValue",
      "noClampOnBlur",
      "handlersRef",
      "classNames",
      "styles",
      "size",
      "rightSection",
      "rightSectionWidth",
      "formatter",
      "parser",
      "inputMode",
      "unstyled",
      "type",
    ]
  );

  const { classes, cx, theme } = useStyles(
    { radius: local.radius, size: local.size },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "NumberInput",
    }
  );

  const parsePrecision = (val: number | undefined) => {
    if (val === undefined) return undefined;

    let result = val.toFixed(local.precision);
    if (local.removeTrailingZeros && local.precision > 0) {
      result = result.replace(new RegExp(`[0]{0,${local.precision}}$`), "");
      if (result.endsWith(".") || result.endsWith(local.decimalSeparator)) {
        result = result.slice(0, -1);
      }
    }
    return result;
  };

  const [focused, setFocused] = createSignal(false);
  const [_value, setValue] = createSignal(
    typeof local.value === "number"
      ? local.value
      : typeof local.defaultValue === "number"
      ? local.defaultValue
      : undefined
  );
  const finalValue = createMemo(() =>
    typeof local.value === "number" ? local.value : untrack(_value)
  );
  const [tempValue, setTempValue] = createWritableMemo(() =>
    typeof finalValue() === "number" ? parsePrecision(finalValue()) : ""
  );
  let inputRef: HTMLInputElement;
  const handleValueChange = (val: number | undefined) => {
    if (val !== _value() && !Number.isNaN(val)) {
      typeof local.onChange === "function" && local.onChange(val);
      setValue(val);
    }
  };

  const formatNum = (val: string | number = "") => {
    let parsedStr = typeof val === "number" ? String(val) : val;

    if (local.decimalSeparator) {
      parsedStr = parsedStr.replace(/\./g, local.decimalSeparator);
    }

    const r = local.formatter(parsedStr);
    return r;
  };

  const parseNum = (val: string): string | undefined => {
    let num = val;

    if (local.decimalSeparator) {
      num = num.replace(new RegExp(`\\${local.decimalSeparator}`, "g"), ".");
    }

    return local.parser(num);
  };

  const _min = typeof local.min === "number" ? local.min : -Infinity;
  const _max = typeof local.max === "number" ? local.max : Infinity;

  let incrementRef: () => void;
  incrementRef = () => {
    if (_value() === undefined) {
      handleValueChange(local.startValue ?? local.min ?? 0);
      setTempValue(
        parsePrecision(local.startValue) ?? parsePrecision(local.min) ?? "0"
      );
    } else {
      const result = parsePrecision(clamp(_value() + local.step, _min, _max));

      handleValueChange(parseFloat(result));
      setTempValue(result);
    }
  };

  let decrementRef: () => void;
  decrementRef = () => {
    if (_value() === undefined) {
      handleValueChange(local.startValue ?? local.min ?? 0);
      setTempValue(
        parsePrecision(local.startValue) ?? parsePrecision(local.min) ?? "0"
      );
    } else {
      const result = parsePrecision(clamp(_value() - local.step, _min, _max));
      handleValueChange(parseFloat(result));
      setTempValue(result);
    }
  };

  (local.handlersRef as ((el: NumberInputHandlers) => void) | undefined)?.({
    increment: incrementRef,
    decrement: decrementRef,
  });

  createEffect(
    on(
      () => local.value,
      () => {
        if (typeof local.value === "number" && !focused()) {
          setValue(local.value);
          setTempValue(parsePrecision(local.value));
        }
        if (
          local.defaultValue === undefined &&
          local.value === undefined &&
          !focused()
        ) {
          setValue(local.value);
          setTempValue("");
        }
      }
    )
  );

  const shouldUseStepInterval =
    local.stepHoldDelay !== undefined && local.stepHoldInterval !== undefined;
  let onStepTimeoutRef: number = null;
  let stepCountRef: number = 0;

  const onStepDone = () => {
    if (onStepTimeoutRef) {
      window.clearTimeout(onStepTimeoutRef);
    }
    onStepTimeoutRef = null;
    stepCountRef = 0;
  };

  const onStepHandleChange = (isIncrement: boolean) => {
    if (isIncrement) {
      incrementRef();
    } else {
      decrementRef();
    }
    stepCountRef += 1;
  };

  const onStepLoop = (isIncrement: boolean) => {
    onStepHandleChange(isIncrement);

    if (shouldUseStepInterval) {
      const interval =
        typeof local.stepHoldInterval === "number"
          ? local.stepHoldInterval
          : local.stepHoldInterval(stepCountRef);
      onStepTimeoutRef = window.setTimeout(
        () => onStepLoop(isIncrement),
        interval
      );
    }
  };

  const onStep = (event: Event, isIncrement: boolean) => {
    event.preventDefault();
    inputRef.focus();
    onStepHandleChange(isIncrement);
    if (shouldUseStepInterval) {
      onStepTimeoutRef = window.setTimeout(
        () => onStepLoop(isIncrement),
        local.stepHoldDelay
      );
    }
  };

  onMount(() => onStepDone());
  onCleanup(() => onStepDone());

  const controls = () => (
    <div class={classes.rightSection}>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden={true}
        disabled={finalValue() >= local.max}
        class={cx(classes.control, classes.controlUp)}
        onPointerDown={(event) => {
          onStep(event, true);
        }}
        onPointerUp={onStepDone}
        onPointerLeave={onStepDone}
      >
        <Chevron
          size={theme.fn.size({ size: local.size, sizes: CHEVRON_SIZES })}
          direction="up"
        />
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden={true}
        disabled={finalValue() <= local.min}
        class={cx(classes.control, classes.controlDown)}
        onPointerDown={(event) => {
          onStep(event, false);
        }}
        onPointerUp={onStepDone}
        onPointerLeave={onStepDone}
      >
        <Chevron
          size={theme.fn.size({ size: local.size, sizes: CHEVRON_SIZES })}
          direction="down"
        />
      </button>
    </div>
  );

  const handleChange = (event: InputEvent & { target: any }) => {
    if (event.isComposing) return;

    const val = event.target.value;
    const parsed = parseNum(val);

    setTempValue(parsed);

    if (val === "" || val === "-") {
      handleValueChange(undefined);
    } else {
      val.trim() !== "" &&
        !Number.isNaN(parsed) &&
        handleValueChange(parseFloat(parsed));
    }
  };

  const handleBlur = (event: FocusEvent & { target: any }) => {
    if (event.target.value === "") {
      setTempValue("");
      handleValueChange(undefined);
    } else {
      let newNumber = event.target.value;

      if (
        newNumber[0] === `${local.decimalSeparator}` ||
        newNumber[0] === "."
      ) {
        newNumber = `0${newNumber}`;
      }

      const parsedVal = parseNum(newNumber);
      const val = clamp(parseFloat(parsedVal), _min, _max);

      if (!Number.isNaN(val)) {
        if (!local.noClampOnBlur) {
          const prec = parsePrecision(val);
          setTempValue(prec);
          handleValueChange(parseFloat(prec));
        }
      } else {
        setTempValue(parsePrecision(finalValue()) ?? "");
      }
    }

    setFocused(false);
    typeof local.onBlur === "function" && local.onBlur(event as any);
  };

  const handleFocus = (event: FocusEvent) => {
    setFocused(true);
    typeof local.onFocus === "function" && local.onFocus(event as any);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    typeof local.onKeyDown === "function" && local.onKeyDown(event as any);
    if (
      event.repeat &&
      shouldUseStepInterval &&
      (event.key === "ArrowUp" || event.key === "ArrowDown")
    ) {
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowUp") {
      onStep(event, true);
    } else if (event.key === "ArrowDown") {
      onStep(event, false);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    typeof local.onKeyUp === "function" && local.onKeyUp(event as any);
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      onStepDone();
    }
  };

  const formattedValue = createMemo(() => formatNum(tempValue()));

  return (
    <TextInput
      {...others}
      type={local.type}
      variant={local.variant}
      value={formattedValue()}
      disabled={local.disabled}
      ref={mergeRefs((e) => (inputRef = e), local.ref)}
      onChange={handleChange as any}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      rightSection={
        local.rightSection ||
        (local.disabled || local.hideControls || local.variant === "unstyled"
          ? null
          : controls)
      }
      rightSectionWidth={
        local.rightSectionWidth ||
        theme.fn.size({ size: local.size, sizes: CONTROL_SIZES }) + 1
      }
      radius={local.radius}
      max={local.max}
      min={local.min}
      step={local.step}
      size={local.size}
      styles={local.styles}
      classNames={local.classNames}
      inputMode={
        local.inputMode || getInputMode(local.step, local.precision, useOs())
      }
      __staticSelector="NumberInput"
      unstyled={local.unstyled}
    />
  );
};

NumberInput.displayName = "@mantine/core/NumberInput";
