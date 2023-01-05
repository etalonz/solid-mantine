import { useReducedMotion } from "hooks";
import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";
import { useMantineTheme } from "styles";

export type TransitionStatus =
  | "entered"
  | "exited"
  | "entering"
  | "exiting"
  | "pre-exiting"
  | "pre-entering";

interface UseTransition {
  duration: number;
  exitDuration: number;
  timingFunction: string;
  mounted: Accessor<boolean>;
  onEnter?(): void;
  onExit?(): void;
  onEntered?(): void;
  onExited?(): void;
}

export function useTransition({
  duration,
  exitDuration,
  timingFunction,
  mounted,
  onEnter,
  onExit,
  onEntered,
  onExited,
}: UseTransition) {
  const theme = useMantineTheme();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const [transitionStatus, setStatus] = createSignal<TransitionStatus>(
    mounted() ? "entered" : "exited"
  );
  let transitionDuration = reduceMotion ? 0 : duration;
  let timeoutRef: number = -1;

  const handleStateChange = (shouldMount: boolean) => {
    const preHandler = shouldMount ? onEnter : onExit;
    const handler = shouldMount ? onEntered : onExited;

    setStatus(shouldMount ? "pre-entering" : "pre-exiting");
    window.clearTimeout(timeoutRef);
    transitionDuration = reduceMotion
      ? 0
      : shouldMount
      ? duration
      : exitDuration;

    if (transitionDuration === 0) {
      typeof preHandler === "function" && preHandler();
      typeof handler === "function" && handler();
      setStatus(shouldMount ? "entered" : "exited");
    } else {
      const preStateTimeout = window.setTimeout(() => {
        typeof preHandler === "function" && preHandler();
        setStatus(shouldMount ? "entering" : "exiting");
      }, 10);

      timeoutRef = window.setTimeout(() => {
        window.clearTimeout(preStateTimeout);
        typeof handler === "function" && handler();
        setStatus(shouldMount ? "entered" : "exited");
      }, transitionDuration);
    }
  };

  createEffect(on(mounted, (v) => handleStateChange(v), { defer: true }));

  onCleanup(() => window.clearTimeout(timeoutRef));

  return {
    transitionDuration: () => transitionDuration,
    transitionStatus,
    transitionTimingFunction: timingFunction || theme.transitionTimingFunction,
  };
}
