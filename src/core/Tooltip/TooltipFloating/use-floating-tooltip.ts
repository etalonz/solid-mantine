import { useFloating } from "floating-ui";
import { shift, getOverflowAncestors } from "@floating-ui/dom";
import { FloatingPosition } from "../../Floating";
import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
} from "solid-js";
import { Accessor } from "solid-js";

interface UseFloatingTooltip {
  offset: Accessor<number>;
  position: Accessor<FloatingPosition>;
}

export function useFloatingTooltip<T extends HTMLElement = any>({
  offset,
  position,
}: UseFloatingTooltip) {
  const [opened, setOpened] = createSignal(false);
  const boundaryRef: { current: T } = { current: null };
  const floating = useFloating({
    placement: position,
    middleware: () => [
      shift({
        crossAxis: true,
        padding: 5,
        rootBoundary: "document",
      }),
    ],
  });

  const horizontalOffset = createMemo(() =>
    floating.placement().includes("right")
      ? offset()
      : position().includes("left")
      ? offset() * -1
      : 0
  );

  const verticalOffset = createMemo(() =>
    floating.placement().includes("bottom")
      ? offset()
      : position().includes("top")
      ? offset() * -1
      : 0
  );

  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    floating.reference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: clientX,
          y: clientY,
          left: clientX + horizontalOffset(),
          top: clientY + verticalOffset(),
          right: clientX,
          bottom: clientY,
        };
      },
    });
  };

  createEffect(
    on([() => floating, opened], ([f]) => {
      if (f.refs.floating()) {
        const boundary = boundaryRef.current;
        boundary.addEventListener("mousemove", handleMouseMove);

        const parents = getOverflowAncestors(f.refs.floating());
        parents.forEach((parent) => {
          parent.addEventListener("scroll", f.update);
        });

        onCleanup(() => {
          boundary.removeEventListener("mousemove", handleMouseMove);
          parents.forEach((parent) => {
            parent.removeEventListener("scroll", f.update);
          });
        });
      }
    })
  );

  return createMemo(() => ({
    handleMouseMove,
    x: floating.x(),
    y: floating.y(),
    opened: opened(),
    setOpened,
    boundaryRef,
    floating: floating,
  }));
}
