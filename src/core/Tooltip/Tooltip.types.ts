import { ComponentProps, FlowProps, JSX, JSXElement } from "solid-js";
import {
  DefaultProps,
  Selectors,
  MantineNumberSize,
  MantineColor,
} from "styles";
import { FloatingPosition } from "../Floating";
import useStyles, { TooltipStylesParams } from "./Tooltip.styles";

export type TooltipStylesNames = Selectors<typeof useStyles>;

export interface TooltipBaseProps
  extends DefaultProps<TooltipStylesNames, TooltipStylesParams>,
    FlowProps<ComponentProps<"div">> {
  /** Tooltip position relative to target element (default) or mouse (floating) */
  position?: FloatingPosition;

  /** Key of the prop that should be used to get element ref */
  refProp?: string;

  /** Tooltip label */
  label: JSXElement;

  /** Determines whether tooltip should be rendered within Portal */
  withinPortal?: boolean;

  /** Radius from theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Key of theme.colors */
  color?: MantineColor;

  /** Defines whether content should be wrapped on to the next line */
  multiline?: boolean;

  /** Tooltip width in px */
  width?: number | "auto";

  /** Tooltip z-index */
  zIndex?: JSX.CSSProperties["z-index"];

  /** Disables tooltip */
  disabled?: boolean;
}
