import {
  Selectors,
  DefaultProps,
  MantineColor,
  MantineNumberSize,
  useComponentDefaultProps,
  getDefaultZIndex,
  Component,
} from "styles";
import { Box } from "../Box";
import { IndicatorPosition } from "./Indicator.types";
import useStyles, { IndicatorStylesParams } from "./Indicator.styles";
import { Machine } from "./Machine/Machine";
import {
  ComponentProps,
  createMemo,
  FlowProps,
  JSX,
  JSXElement,
  splitProps,
} from "solid-js";

export type IndicatorStylesNames = Selectors<typeof useStyles>;

export interface IndicatorProps
  extends DefaultProps<IndicatorStylesNames, IndicatorStylesParams>,
    FlowProps<ComponentProps<"div">> {
  /** Indicator position relative to child element */
  position?: IndicatorPosition;

  /** Changes position offset, usually used when element has border-radius */
  offset?: number;

  /** Determines whether indicator container should be an inline element */
  inline?: boolean;

  /** Size in px */
  size?: number;

  /** Indicator label */
  label?: JSXElement;

  /** Indicator count overflowCount */
  overflowCount?: number;

  dot?: boolean;

  /** border-radius from theme.radius or number value to set radius in px */
  radius?: MantineNumberSize;

  /** Color from theme.colors or any other valid CSS color value */
  color?: MantineColor;

  /** Determines whether indicator should have border */
  withBorder?: boolean;

  /** When component is disabled it renders children without indicator */
  disabled?: boolean;

  /** When showZero is true and label is zero  renders children with indicator*/
  showZero?: boolean;

  /** Indicator processing animation */
  processing?: boolean;

  /** Indicator z-index */
  zIndex?: JSX.CSSProperties["z-index"];
}

const defaultProps: Partial<IndicatorProps> = {
  position: "top-end",
  offset: 0,
  inline: false,
  withBorder: false,
  disabled: false,
  showZero: true,
  processing: false,
  dot: true,
  size: 10,
  overflowCount: 99,
  radius: 1000,
  zIndex: getDefaultZIndex("app"),
};

export const Indicator: Component<IndicatorProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Indicator", defaultProps, props),
    [
      "children",
      "position",
      "offset",
      "size",
      "radius",
      "inline",
      "withBorder",
      "className",
      "color",
      "dot",
      "styles",
      "label",
      "overflowCount",
      "showZero",
      "classNames",
      "disabled",
      "zIndex",
      "unstyled",
      "processing",
    ]
  );

  const { classes, cx } = useStyles(
    {
      position: local.position,
      offset: local.offset,
      size: local.size,
      radius: local.radius,
      inline: local.inline,
      color: local.color,
      withBorder: local.withBorder,
      zIndex: local.zIndex,
      withLabel: !!local.label,
    },
    {
      name: "Indicator",
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );

  const renderLabel = createMemo(() => {
    if (typeof local.label === "number") {
      return <Machine value={local.label} max={local.overflowCount} />;
    }
    return local.label;
  });

  const isShowIndicator = createMemo(
    () =>
      !local.disabled &&
      (local.dot ||
        (local.label != null && !(local.label <= 0 && !local.showZero)))
  );

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      {isShowIndicator() && (
        <>
          <div class={cx(classes.indicator, classes.common)}>
            {renderLabel()}
          </div>
          {local.processing && (
            <div class={cx(classes.processing, classes.common)} />
          )}
        </>
      )}
      {local.children}
    </Box>
  );
};

Indicator.displayName = "@mantine/core/Indicator";
