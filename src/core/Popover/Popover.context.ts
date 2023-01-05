import { createSafeContext } from "utils";
import { MantineNumberSize, MantineShadow } from "styles";
import { FloatingPosition } from "../Floating";
import { MantineTransition } from "../Transition";
import { POPOVER_ERRORS } from "./Popover.errors";
import { PopoverWidth } from "./Popover.types";
import { JSX, Accessor } from "solid-js";

interface PopoverContext {
  x: Accessor<number>;
  y: Accessor<number>;
  arrowX: Accessor<number>;
  arrowY: Accessor<number>;
  setArrowRef: (r: HTMLDivElement) => void;
  opened: Accessor<boolean>;
  transition: MantineTransition;
  transitionDuration: number;
  exitTransitionDuration: number;
  reference: (node: HTMLElement) => void;
  floating: (node: HTMLElement) => void;
  width?: PopoverWidth;
  withArrow: boolean;
  arrowSize: number;
  arrowOffset: number;
  arrowRadius: number;
  trapFocus: Accessor<boolean>;
  placement: Accessor<FloatingPosition>;
  withinPortal: boolean;
  closeOnEscape: boolean;
  zIndex: JSX.CSSProperties["z-index"];
  radius?: MantineNumberSize;
  shadow?: MantineShadow;
  onClose?(): void;
  getDropdownId(): string;
  getTargetId(): string;
  controlled: boolean;
  onToggle(): void;
  withRoles: boolean;
  targetProps: Record<string, any>;
  disabled: boolean;
  returnFocus: boolean;
}

export const [PopoverContextProvider, usePopoverContext] =
  createSafeContext<PopoverContext>(POPOVER_ERRORS.context);
