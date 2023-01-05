import { JSX, JSXElement, Match, Switch } from "solid-js";
import { getTransitionStyles } from "./get-transition-styles/get-transition-styles";
import { useTransition } from "./use-transition";
import { MantineTransition } from "./transitions";

interface GroupedTransitionItem {
  duration: number;
  timingFunction?: JSX.CSSProperties["transition-timing-function"];
  transition: MantineTransition;
}

export interface GroupedTransitionProps {
  /** Transitions group */
  transitions: Record<string, GroupedTransitionItem>;

  /** Render function with transition group styles argument */
  children(styles: Record<string, JSX.CSSProperties>): JSXElement;

  /** Enter transition duration in ms */
  duration?: number;

  /** Exit transition duration in ms */
  exitDuration?: number;

  /** Transition timing function, defaults to theme.transitionTimingFunction */
  timingFunction?: string;

  /** When true, component will be mounted */
  mounted: boolean;

  /** Calls when exit transition ends */
  onExited?: () => void;

  /** Calls when exit transition starts */
  onExit?: () => void;

  /** Calls when enter transition starts */
  onEnter?: () => void;

  /** Calls when enter transition ends */
  onEntered?: () => void;
}

export function GroupedTransition(props: GroupedTransitionProps) {
  const { transitionDuration, transitionStatus, transitionTimingFunction } =
    useTransition({
      mounted: () => props.mounted,
      duration: props.duration || 250,
      exitDuration: props.exitDuration,
      timingFunction: props.timingFunction,
      onExit: props.onExit,
      onEntered: props.onEntered,
      onEnter: props.onEnter,
      onExited: props.onExited,
    });

  return (
    <Switch fallback={null}>
      <Match when={transitionDuration === 0 && props.mounted}>
        {props.children({})}
      </Match>
      <Match when={transitionStatus() !== "exited"}>
        {props.children(
          Object.keys(props.transitions).reduce((acc, transition) => {
            acc[transition] = getTransitionStyles({
              duration: props.transitions[transition].duration,
              transition: props.transitions[transition].transition,
              timingFunction:
                props.transitions[transition].timingFunction ||
                transitionTimingFunction,
              state: transitionStatus(),
            });

            return acc;
          }, {})
        )}
      </Match>
    </Switch>
  );
}

GroupedTransition.displayName = "@mantine/core/GroupedTransition";
