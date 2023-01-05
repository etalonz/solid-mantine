import { ComponentProps, JSX, splitProps } from "solid-js";
import {
  DefaultProps,
  useComponentDefaultProps,
  SystemProp,
  SpacingValue,
  Component,
} from "styles";
import { packSx } from "utils";
import { Box, getSystemStyles } from "../Box";
import { FLEX_SYSTEM_PROPS } from "./flex-props";

export interface FlexProps extends DefaultProps, ComponentProps<"div"> {
  /** gap CSS property */
  gap?: SystemProp<SpacingValue>;

  /** row-gap CSS property */
  rowGap?: SystemProp<SpacingValue>;

  /** column-gap CSS property */
  columnGap?: SystemProp<SpacingValue>;

  /** align-items CSS property */
  align?: SystemProp<JSX.CSSProperties["align-items"]>;

  /** justify-content CSS property */
  justify?: SystemProp<JSX.CSSProperties["justify-content"]>;

  /** flex-wrap CSS property */
  wrap?: SystemProp<JSX.CSSProperties["flex-wrap"]>;

  /** flex-direction CSS property */
  direction?: SystemProp<JSX.CSSProperties["flex-direction"]>;
}

const defaultProps: Partial<FlexProps> = {};

export const Flex: Component<FlexProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Flex", defaultProps, props),
    [
      "gap",
      "rowGap",
      "columnGap",
      "align",
      "justify",
      "wrap",
      "direction",
      "sx",
    ]
  );

  return (
    <Box
      {...others}
      sx={[
        { display: "flex" },
        (theme) =>
          getSystemStyles(
            {
              gap: local.gap,
              rowGap: local.rowGap,
              columnGap: local.columnGap,
              align: local.align,
              justify: local.justify,
              wrap: local.wrap,
              direction: local.direction,
            },
            theme,
            FLEX_SYSTEM_PROPS
          ),
        ...packSx(local.sx),
      ]}
    />
  );
};

Flex.displayName = "@mantine/core/Flex";
