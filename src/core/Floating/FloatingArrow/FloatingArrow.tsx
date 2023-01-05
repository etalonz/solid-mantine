import { Component, useMantineTheme } from "styles";
import { getArrowPositionStyles } from "./get-arrow-position-styles";
import { FloatingPosition } from "../types";
import { ComponentProps, createEffect, Show, splitProps } from "solid-js";
import { applyStyles } from "utils";

interface FloatingArrowProps extends ComponentProps<"div"> {
  withBorder: boolean;
  position: FloatingPosition;
  arrowSize: number;
  arrowOffset: number;
  arrowRadius: number;
  arrowX: number;
  arrowY: number;
  visible: boolean;
}

export const FloatingArrow: Component<FloatingArrowProps> = (props) => {
  const theme = useMantineTheme();
  const [local, others] = splitProps(props, [
    "withBorder",
    "position",
    "arrowSize",
    "arrowOffset",
    "arrowRadius",
    "visible",
    "arrowX",
    "arrowY",
  ]);

  const arrow = <div {...others} />;

  createEffect(() =>
    applyStyles(
      arrow as HTMLElement,
      getArrowPositionStyles({
        withBorder: local.withBorder,
        position: local.position,
        arrowSize: local.arrowSize,
        arrowOffset: local.arrowOffset,
        arrowRadius: local.arrowRadius,
        dir: theme.dir,
        arrowX: local.arrowX,
        arrowY: local.arrowY,
      })
    )
  );

  return <Show when={local.visible}>{arrow}</Show>;
};

FloatingArrow.displayName = "@mantine/core/FloatingArrow";
