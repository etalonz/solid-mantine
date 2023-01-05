import { ComponentProps, JSXElement, splitProps } from "solid-js";
import { useMantineTheme, MantineColor } from "styles";
import { Tooltip } from "../../Tooltip";
import { getCurveProps } from "./get-curve-props";

interface CurveProps extends ComponentProps<"circle"> {
  value?: number;
  size: number;
  offset: number;
  sum: number;
  thickness: number;
  lineRoundCaps: boolean;
  root?: boolean;
  color?: MantineColor;
  tooltip?: JSXElement;
}

export function Curve(props: CurveProps) {
  const [local, others] = splitProps(props, [
    "size",
    "value",
    "offset",
    "sum",
    "thickness",
    "root",
    "color",
    "lineRoundCaps",
    "tooltip",
  ]);

  const theme = useMantineTheme();
  const stroke = theme.fn.themeColor(
    local.color || (theme.colorScheme === "dark" ? "dark" : "gray"),
    local.color
      ? theme.fn.primaryShade()
      : theme.colorScheme === "dark"
      ? 4
      : 1,
    false
  );

  return (
    <Tooltip.Floating disabled={!local.tooltip} label={local.tooltip}>
      <circle
        {...others}
        fill="none"
        stroke-linecap={local.lineRoundCaps ? "round" : "butt"}
        stroke={stroke}
        {...getCurveProps({
          sum: local.sum,
          size: local.size,
          thickness: local.thickness,
          value: local.value,
          offset: local.offset,
          root: local.root,
        })}
      />
    </Tooltip.Floating>
  );
}

Curve.displayName = "@mantine/core/Curve";
