import {
  ComponentProps,
  For,
  JSX,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";
import {
  Component,
  DefaultProps,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { toPx } from "utils";
import { Box } from "../Box";
import { Curve } from "./Curve/Curve";
import { getCurves } from "./get-curves/get-curves";
import useStyles from "./RingProgress.styles";

export type RingProgressStylesNames = Selectors<typeof useStyles>;

interface RingProgressSection extends ComponentProps<"circle"> {
  value: number;
  color: MantineColor;
  tooltip?: JSXElement;
}

export interface RingProgressProps
  extends DefaultProps<RingProgressStylesNames>,
    ComponentProps<"div"> {
  /** Label displayed in the center of the ring */
  label?: JSXElement;

  /** Ring thickness */
  thickness?: number;

  /** Width and height of the progress ring in px */
  size?: number;

  /** Sets whether the edges of the progress circle are rounded */
  roundCaps?: boolean;

  /** Ring sections */
  sections: RingProgressSection[];
}

const defaultProps: Partial<RingProgressProps> = {
  size: 120,
  thickness: 12,
};

export const RingProgress: Component<RingProgressProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("RingProgress", defaultProps, props),
    [
      "className",
      "style",
      "label",
      "sections",
      "size",
      "thickness",
      "classNames",
      "styles",
      "roundCaps",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(null, {
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    name: "RingProgress",
  });

  return (
    <Box
      style={{
        width: toPx(local.size),
        height: toPx(local.size),
        ...(local.style as JSX.CSSProperties),
      }}
      className={cx(classes.root, local.className)}
      {...others}
    >
      <svg
        width={local.size}
        height={local.size}
        style={{ transform: "rotate(-90deg)" }}
      >
        <For
          each={getCurves({
            size: local.size,
            thickness: local.thickness,
            sections: local.sections,
            renderRoundedLineCaps: local.roundCaps,
          })}
        >
          {({ data, sum, root, lineRoundCaps, offset }) => (
            <Curve
              {...data}
              value={data?.value}
              size={local.size}
              thickness={local.thickness}
              sum={sum}
              offset={offset}
              color={data?.color}
              root={root}
              lineRoundCaps={lineRoundCaps}
              tooltip={data?.tooltip}
            />
          )}
        </For>
      </svg>

      <Show when={local.label}>
        <div
          class={classes.label}
          style={{
            right: toPx(local.thickness * 2),
            left: toPx(local.thickness * 2),
          }}
        >
          {local.label}
        </div>
      </Show>
    </Box>
  );
};

RingProgress.displayName = "@mantine/core/RingProgress";
