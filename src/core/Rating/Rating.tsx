import {
  DefaultProps,
  MantineSize,
  useComponentDefaultProps,
  Selectors,
  MantineColor,
  Component,
} from "styles";
import { useUncontrolled, clamp, useId } from "hooks";
import { Box } from "../Box";
import { RatingItem, RatingItemStylesNames } from "./RatingItem/RatingItem";
import useStyles from "./Rating.styles";
import {
  ComponentProps,
  createMemo,
  createSignal,
  For,
  JSXElement,
  splitProps,
} from "solid-js";
import { mergeRefs } from "@solid-primitives/refs";

function roundValueTo(value: number, to: number) {
  const rounded = Math.round(value / to) * to;
  const precision = `${to}`.split(".")[1]?.length || 0;
  return Number(rounded.toFixed(precision));
}

export type RatingStylesNames =
  | Selectors<typeof useStyles>
  | RatingItemStylesNames;

export interface RatingProps
  extends DefaultProps<RatingStylesNames>,
    Omit<ComponentProps<"div">, "onChange"> {
  /** Default value for uncontrolled component */
  defaultValue?: number;

  /** Value for controlled component */
  value?: number;

  /** Called when value changes */
  onChange?(value: number): void;

  /** The icon that is displayed when symbol is empty */
  emptySymbol?: JSXElement | ((value: number) => JSXElement);

  /** This icon that is displayed when symbol is full */
  fullSymbol?: JSXElement | ((value: number) => JSXElement);

  /** Number of fractions each item can be divided into, 1 by default */
  fractions?: number;

  /** Controls component size */
  size?: MantineSize;

  /** Number of controls that should be rendered */
  count?: number;

  /** Called when item is hovered */
  onHover?(value: number): void;

  /** Function should return labelText for the symbols */
  getSymbolLabel?: (value: number) => string;

  /** Name of rating, should be unique within the page */
  name?: string;

  /** If true, you won't be able to interact */
  readOnly?: boolean;

  /** If true, only the selected symbol will change to full symbol */
  highlightSelectedOnly?: boolean;

  /** Key of theme.colors or any CSS color value, yellow by default */
  color?: MantineColor;
}

const defaultProps: Partial<RatingProps> = {
  size: "sm",
  getSymbolLabel: (value) => `${value}`,
  count: 5,
  fractions: 1,
  color: "yellow",
};

export const Rating: Component<RatingProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Rating", defaultProps, props),
    [
      "ref",
      "defaultValue",
      "value",
      "emptySymbol",
      "fullSymbol",
      "size",
      "count",
      "fractions",
      "onChange",
      "onHover",
      "getSymbolLabel",
      "name",
      "readOnly",
      "className",
      "classNames",
      "styles",
      "unstyled",
      "onMouseEnter",
      "onMouseMove",
      "onMouseLeave",
      "highlightSelectedOnly",
      "color",
      "id",
    ]
  );

  const { classes, cx, theme } = useStyles(null, {
    name: "Rating",
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
  });

  const _name = useId(local.name);
  const _id = useId(local.id);

  let rootRef: HTMLDivElement = null;

  const [_value, setValue] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: 0,
    onChange: local.onChange,
  });

  const [hovered, setHovered] = createSignal(-1);
  const [isOutside, setOutside] = createSignal(true);

  const _fractions = createMemo(() => Math.floor(local.fractions));
  const _count = createMemo(() => Math.floor(local.count));

  const decimalUnit = createMemo(() => 1 / _fractions());
  const stableValueRounded = createMemo(() =>
    roundValueTo(_value(), decimalUnit())
  );
  const finalValue = createMemo(() =>
    hovered() !== -1 ? hovered() : stableValueRounded()
  );

  const handleMouseEnter = (event: MouseEvent) => {
    (local.onMouseEnter as any)?.(event);
    !local.readOnly && setOutside(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    (local.onMouseMove as any)?.(event);

    if (local.readOnly) {
      return;
    }

    const { left, right, width } = rootRef.getBoundingClientRect();
    const symbolWidth = width / _count();

    const hoverPosition =
      theme.dir === "rtl" ? right - event.clientX : event.clientX - left;
    const hoverValue = hoverPosition / symbolWidth;

    const rounded = clamp(
      roundValueTo(hoverValue + decimalUnit() / 2, decimalUnit()),
      decimalUnit(),
      _count()
    );

    setHovered(rounded);
    rounded !== hovered() && local.onHover?.(rounded);
  };

  const handleMouseLeave = (event: MouseEvent) => {
    (local.onMouseLeave as any)?.(event);

    if (local.readOnly) {
      return;
    }

    setHovered(-1);
    setOutside(true);
    hovered() !== -1 && local.onHover?.(-1);
  };

  const handleItemBlur = () => isOutside() && setHovered(-1);

  const handleChange = (event: any) => {
    const resultedValue = parseFloat(event.target.value);
    setValue(resultedValue);
  };

  return (
    <Box
      ref={mergeRefs((r) => (rootRef = r), local.ref)}
      className={cx(classes.root, local.className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...others}
    >
      <For each={Array(_count()).fill(0)}>
        {(_, index) => {
          const integerValue = index() + 1;
          const fractionItems = Array.from(
            new Array(index() === 0 ? _fractions() + 1 : _fractions())
          );
          const isGroupActive =
            !local.readOnly && Math.ceil(hovered()) === integerValue;

          return (
            <div data-active={isGroupActive} class={classes.symbolGroup}>
              <For each={fractionItems}>
                {(__, fractionIndex) => {
                  const fractionValue =
                    decimalUnit() *
                    (index() === 0 ? fractionIndex() : fractionIndex() + 1);
                  const symbolValue = roundValueTo(
                    integerValue - 1 + fractionValue,
                    decimalUnit()
                  );

                  return (
                    <RatingItem
                      size={local.size}
                      getSymbolLabel={local.getSymbolLabel}
                      emptyIcon={local.emptySymbol}
                      fullIcon={local.fullSymbol}
                      full={
                        local.highlightSelectedOnly
                          ? symbolValue === finalValue()
                          : symbolValue <= finalValue()
                      }
                      active={symbolValue === finalValue()}
                      checked={symbolValue === stableValueRounded()}
                      readOnly={local.readOnly}
                      fractionValue={fractionValue}
                      value={symbolValue}
                      name={_name}
                      onChange={handleChange}
                      onBlur={handleItemBlur}
                      classNames={local.classNames}
                      styles={local.styles}
                      unstyled={local.unstyled}
                      color={local.color}
                      id={`${_id}-${index()}-${fractionIndex()}`}
                    />
                  );
                }}
              </For>
            </div>
          );
        }}
      </For>
    </Box>
  );
};

Rating.displayName = "@mantine/core/Rating";
