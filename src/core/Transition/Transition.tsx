import { children, createEffect, JSXElement, on, Show } from "solid-js";
import { getTransitionStyles } from "./get-transition-styles/get-transition-styles";
import { useTransition } from "./use-transition";
import { MantineTransition } from "./transitions";
import { applyStyles } from "utils";

export interface TransitionProps {
  /** Predefined transition name or transition styles */
  transition: MantineTransition;

  /** Transition duration in ms */
  duration?: number;

  /** Exit transition duration in ms */
  exitDuration?: number;

  /** Transition timing function, defaults to theme.transitionTimingFunction */
  timingFunction?: string;

  /** When true, component will be mounted */
  mounted: boolean;

  /** Render function with transition styles argument */
  children: JSXElement;

  /** Calls when exit transition ends */
  onExited?: () => void;

  /** Calls when exit transition starts */
  onExit?: () => void;

  /** Calls when enter transition starts */
  onEnter?: () => void;

  /** Calls when enter transition ends */
  onEntered?: () => void;
}

export function Transition(props: TransitionProps) {
  const { transitionDuration, transitionStatus, transitionTimingFunction } =
    useTransition({
      mounted: () => props.mounted,
      exitDuration: props.exitDuration,
      duration: props.duration || 250,
      timingFunction: props.timingFunction,
      onExit: props.onExit,
      onEntered: props.onEntered,
      onEnter: props.onEnter,
      onExited: props.onExited,
    });

  const Children = children(() => props.children).toArray()[0] as HTMLElement;

  createEffect(
    on(transitionStatus, (status) => {
      if (transitionDuration() === 0) return;
      applyStyles(
        Children,
        getTransitionStyles({
          transition: props.transition,
          duration: transitionDuration(),
          state: status,
          timingFunction: transitionTimingFunction,
        })
      );
    })
  );

  return <Show when={transitionStatus() !== "exited"}>{Children}</Show>;
}

Transition.displayName = "@mantine/core/Transition";
