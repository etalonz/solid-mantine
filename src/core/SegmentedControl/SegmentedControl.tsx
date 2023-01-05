import { mergeRefs } from "@solid-primitives/refs";
import {
  useReducedMotion,
  useResizeObserver,
  useUncontrolled,
  useId,
} from "hooks";
import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  MantineSize,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
  useMantineTheme,
  Component,
} from "styles";
import { Box } from "../Box";
import useStyles, {
  WRAPPER_PADDING,
  SegmentedControlStylesParams,
} from "./SegmentedControl.styles";

export interface SegmentedControlItem {
  value: string;
  label: JSXElement;
  disabled?: boolean;
}

export type SegmentedControlStylesNames = Selectors<typeof useStyles>;

export interface SegmentedControlProps
  extends DefaultProps<
      SegmentedControlStylesNames,
      SegmentedControlStylesParams
    >,
    Omit<ComponentProps<"div">, "value" | "onChange"> {
  /** Data based on which controls are rendered */
  data: string[] | SegmentedControlItem[];

  /** Current selected value */
  value?: string;

  /** Disabled input state */
  disabled?: boolean;

  /** Called when value changes */
  onChange?(value: string): void;

  /** Name of the radio group, default to random id */
  name?: string;

  /** True if component should have 100% width */
  fullWidth?: boolean;

  /** Active control color from theme.colors, defaults to white in light color scheme and theme.colors.dark[9] in dark */
  color?: MantineColor;

  /** Controls font-size, paddings and height */
  size?: MantineSize;

  /** Border-radius from theme or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Transition duration in ms, set to 0 to turn off transitions */
  transitionDuration?: number;

  /** Transition timing function for all transitions, defaults to theme.transitionTimingFunction */
  transitionTimingFunction?: string;

  /** Default value for uncontrolled component */
  defaultValue?: string;

  /** Display Vertically */
  orientation?: "vertical" | "horizontal";
}

const defaultProps: Partial<SegmentedControlProps> = {
  disabled: false,
  size: "sm",
  transitionDuration: 200,
};

export const SegmentedControl: Component<SegmentedControlProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("SegmentedControl", defaultProps, props),
    [
      "ref",
      "className",
      "disabled",
      "data",
      "name",
      "value",
      "onChange",
      "color",
      "fullWidth",
      "radius",
      "size",
      "transitionDuration",
      "transitionTimingFunction",
      "classNames",
      "styles",
      "defaultValue",
      "orientation",
      "unstyled",
    ]
  );

  const theme = useMantineTheme();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;

  const data = createMemo(() =>
    local.data.map(
      (item: string | SegmentedControlItem): SegmentedControlItem =>
        typeof item === "string" ? { label: item, value: item } : item
    )
  );

  let mounted: Boolean;

  const [shouldAnimate, setShouldAnimate] = createSignal(false);
  const [_value, handleValueChange] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: Array.isArray(data())
      ? data().find((item) => !item.disabled)?.value ?? data()[0]?.value ?? null
      : null,
    onChange: local.onChange,
  });

  const { classes, cx } = useStyles(
    {
      size: local.size,
      fullWidth: local.fullWidth,
      color: local.color,
      radius: local.radius,
      shouldAnimate: reduceMotion || !shouldAnimate(),
      transitionDuration: local.transitionDuration,
      transitionTimingFunction: local.transitionTimingFunction,
      orientation: local.orientation,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "SegmentedControl",
    }
  );

  const [activePosition, setActivePosition] = createSignal({
    width: 0,
    height: 0,
    translate: [0, 0],
  });
  const uuid = useId(local.name);
  const refs: Record<string, HTMLLabelElement> = {};
  const [observerRef, setObserverRef, containerRect] = useResizeObserver();

  createEffect(() => {
    if (!mounted) {
      mounted = true;
      setShouldAnimate(false);
    } else {
      setShouldAnimate(true);
    }
  });

  createEffect(() => {
    if (_value() in refs && observerRef()) {
      const element = refs[_value()];
      const elementRect = element.getBoundingClientRect();
      const scaledValue = element.offsetWidth / elementRect.width;
      const width = elementRect.width * scaledValue || 0;
      const height = elementRect.height * scaledValue || 0;

      const offsetRight =
        containerRect().width -
        element.parentElement.offsetLeft +
        WRAPPER_PADDING -
        width;
      const offsetLeft = element.parentElement.offsetLeft - WRAPPER_PADDING;

      setActivePosition({
        width,
        height,
        translate: [
          theme.dir === "rtl" ? offsetRight : offsetLeft,
          element.parentElement.offsetTop - WRAPPER_PADDING,
        ],
      });
    }
  });

  return (
    <Show when={data().length > 0}>
      <Box
        className={cx(classes.root, local.className)}
        ref={mergeRefs(setObserverRef, local.ref)}
        {...others}
      >
        {typeof _value() === "string" && shouldAnimate() && (
          <Box
            component="span"
            className={classes.active}
            sx={{
              width: activePosition().width,
              height: activePosition().height,
              transform: `translate(${activePosition().translate[0]}px, ${
                activePosition().translate[1]
              }px )`,
            }}
          />
        )}

        <For each={data()}>
          {(item) => (
            <div
              class={cx(classes.control, {
                [classes.controlActive]: _value() === item.value,
              })}
            >
              <input
                class={classes.input}
                disabled={local.disabled || item.disabled}
                type="radio"
                name={uuid}
                value={item.value}
                id={`${uuid}-${item.value}`}
                checked={_value() === item.value}
                onChange={() => handleValueChange(item.value)}
              />

              <label
                class={cx(classes.label, {
                  [classes.labelActive]: _value() === item.value,
                  [classes.disabled]: local.disabled || item.disabled,
                })}
                for={`${uuid}-${item.value}`}
                ref={(node) => {
                  refs[item.value] = node;
                }}
              >
                {item.label}
              </label>
            </div>
          )}
        </For>
      </Box>
    </Show>
  );
};

SegmentedControl.displayName = "@mantine/core/SegmentedControl";
