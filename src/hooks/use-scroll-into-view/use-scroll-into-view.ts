import { onCleanup } from "solid-js";
import { useReducedMotion } from "../use-reduced-motion/use-reduced-motion";
import { useWindowEvent } from "../use-window-event/use-window-event";
import { easeInOutQuad } from "./utils/ease-in-out-quad";
import { getRelativePosition } from "./utils/get-relative-position";
import { getScrollStart } from "./utils/get-scroll-start";
import { setScrollParam } from "./utils/set-scroll-param";

interface ScrollIntoViewAnimation {
  /** target element alignment relatively to parent based on current axis */
  alignment?: "start" | "end" | "center";
}

interface ScrollIntoViewParams {
  /** callback fired after scroll */
  onScrollFinish?: () => void;

  /** duration of scroll in milliseconds */
  duration?: number;

  /** axis of scroll */
  axis?: "x" | "y";

  /** custom mathematical easing function */
  easing?: (t: number) => number;

  /** additional distance between nearest edge and element */
  offset?: number;

  /** indicator if animation may be interrupted by user scrolling */
  cancelable?: boolean;

  /** prevents content jumping in scrolling lists with multiple targets */
  isList?: boolean;
}

export function useScrollIntoView<
  Target extends HTMLElement,
  Parent extends HTMLElement | null = null
>({
  duration = 1250,
  axis = "y",
  onScrollFinish,
  easing = easeInOutQuad,
  offset = 0,
  cancelable = true,
  isList = false,
}: ScrollIntoViewParams = {}) {
  let frameID = 0;
  let startTime = 0;
  let shouldStop = false;

  let scrollableRef: Parent = null;
  let targetRef: Target = null;

  const reducedMotion = useReducedMotion();

  const cancel = (): void => {
    if (frameID) {
      cancelAnimationFrame(frameID);
    }
  };

  const scrollIntoView = ({
    alignment = "start",
  }: ScrollIntoViewAnimation = {}) => {
    shouldStop = false;

    if (frameID) {
      cancel();
    }

    const start = getScrollStart({ parent: scrollableRef, axis }) ?? 0;

    const change =
      getRelativePosition({
        parent: scrollableRef,
        target: targetRef,
        axis,
        alignment,
        offset,
        isList,
      }) - (scrollableRef ? 0 : start);

    function animateScroll() {
      if (startTime === 0) {
        startTime = performance.now();
      }

      const now = performance.now();
      const elapsed = now - startTime;

      // easing timing progress
      const t = reducedMotion || duration === 0 ? 1 : elapsed / duration;

      const distance = start + change * easing(t);

      setScrollParam({
        parent: scrollableRef,
        axis,
        distance,
      });

      if (!shouldStop && t < 1) {
        frameID = requestAnimationFrame(animateScroll);
      } else {
        typeof onScrollFinish === "function" && onScrollFinish();
        startTime = 0;
        frameID = 0;
        cancel();
      }
    }
    animateScroll();
  };

  const handleStop = () => {
    if (cancelable) {
      shouldStop = true;
    }
  };

  /**
   * detection of one of these events stops scroll animation
   * wheel - mouse wheel / touch pad
   * touchmove - any touchable device
   */

  useWindowEvent("wheel", handleStop, {
    passive: true,
  });

  useWindowEvent("touchmove", handleStop, {
    passive: true,
  });

  // cleanup requestAnimationFrame
  onCleanup(cancel);

  return {
    scrollableRef,
    targetRef,
    setScrollableRef: (r) => (scrollableRef = r),
    setTargetRef: (r) => (targetRef = r),
    scrollIntoView,
    cancel,
  };
}
