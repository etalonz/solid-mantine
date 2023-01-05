import { JSX } from "solid-js";
import type {
  FloatingPosition,
  FloatingSide,
  FloatingPlacement,
} from "../types";
import { toPx } from "utils";

function horizontalSide(
  placement: FloatingPlacement | "center",
  arrowY: number,
  arrowOffset: number
): JSX.CSSProperties {
  if (placement === "center") {
    return { top: toPx(arrowY) };
  }

  if (placement === "end") {
    return { bottom: toPx(arrowOffset) };
  }

  if (placement === "start") {
    return { top: toPx(arrowOffset) };
  }

  return {};
}

function verticalSide(
  placement: FloatingPlacement | "center",
  arrowX: number,
  arrowOffset: number,
  dir: "rtl" | "ltr"
): JSX.CSSProperties {
  if (placement === "center") {
    return { [dir === "ltr" ? "left" : "right"]: toPx(arrowX) };
  }

  if (placement === "end") {
    return { [dir === "ltr" ? "right" : "left"]: toPx(arrowOffset) };
  }

  if (placement === "start") {
    return { [dir === "ltr" ? "left" : "right"]: toPx(arrowOffset) };
  }

  return {};
}

const radiusByFloatingSide: Record<
  FloatingSide,
  keyof Pick<
    JSX.CSSProperties,
    | "border-bottom-left-radius"
    | "border-bottom-right-radius"
    | "border-top-left-radius"
    | "border-top-right-radius"
  >
> = {
  bottom: "border-top-left-radius",
  left: "border-top-right-radius",
  right: "border-bottom-left-radius",
  top: "border-bottom-right-radius",
};

export function getArrowPositionStyles({
  position,
  withBorder,
  arrowSize,
  arrowOffset,
  arrowRadius,
  arrowX,
  arrowY,
  dir,
}: {
  position: FloatingPosition;
  withBorder: boolean;
  arrowSize: number;
  arrowOffset: number;
  arrowRadius: number;
  arrowX: number;
  arrowY: number;
  dir: "rtl" | "ltr";
}): JSX.CSSProperties {
  const [side, placement = "center"] = position.split("-") as [
    FloatingSide,
    FloatingPlacement
  ];
  const baseStyles: JSX.CSSProperties = {
    width: toPx(arrowSize),
    height: toPx(arrowSize),
    transform: "rotate(45deg)",
    position: "absolute",
    [radiusByFloatingSide[side]]: toPx(arrowRadius),
  };

  const arrowPosition = toPx(withBorder ? -arrowSize / 2 - 1 : -arrowSize / 2);

  if (side === "left") {
    return {
      ...baseStyles,
      ...horizontalSide(placement, arrowY, arrowOffset),
      right: arrowPosition,
      "border-left": 0,
      "border-bottom": 0,
    };
  }

  if (side === "right") {
    return {
      ...baseStyles,
      ...horizontalSide(placement, arrowY, arrowOffset),
      left: arrowPosition,
      "border-right": 0,
      "border-top": 0,
    };
  }

  if (side === "top") {
    return {
      ...baseStyles,
      ...verticalSide(placement, arrowX, arrowOffset, dir),
      bottom: arrowPosition,
      "border-top": 0,
      [dir === "ltr" ? "border-left" : "border-right"]: 0,
    };
  }

  if (side === "bottom") {
    return {
      ...baseStyles,
      ...verticalSide(placement, arrowX, arrowOffset, dir),
      top: arrowPosition,
      "border-bottom": 0,
      [dir === "ltr" ? "border-right" : "border-left"]: 0,
    };
  }

  return {};
}
