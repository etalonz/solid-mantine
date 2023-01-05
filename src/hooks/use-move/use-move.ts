import { createSignal, onCleanup, onMount } from "solid-js";
import { clamp } from "../utils";

export interface UseMovePosition {
  x: number;
  y: number;
}

export const clampUseMovePosition = (position: UseMovePosition) => ({
  x: clamp(position.x, 0, 1),
  y: clamp(position.y, 0, 1),
});

interface useMoveHandlers {
  onScrubStart?(): void;
  onScrubEnd?(): void;
}

export function useMove<T extends HTMLElement = HTMLDivElement>(
  onChange: (value: UseMovePosition) => void,
  handlers?: useMoveHandlers,
  dir: "ltr" | "rtl" = "ltr"
) {
  let ref: T = null;
  let isSliding = false;
  let frame = 0;
  const [active, setActive] = createSignal(false);

  const onScrub = ({ x, y }: UseMovePosition) => {
    cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      if (ref) {
        ref.style.userSelect = "none";
        const rect = ref.getBoundingClientRect();

        if (rect.width && rect.height) {
          const _x = clamp((x - rect.left) / rect.width, 0, 1);
          onChange({
            x: dir === "ltr" ? _x : 1 - _x,
            y: clamp((y - rect.top) / rect.height, 0, 1),
          });
        }
      }
    });
  };

  const bindEvents = () => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopScrubbing);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", stopScrubbing);
  };

  const unbindEvents = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopScrubbing);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", stopScrubbing);
  };

  const startScrubbing = () => {
    if (!isSliding) {
      isSliding = true;
      typeof handlers?.onScrubStart === "function" && handlers.onScrubStart();
      setActive(true);
      bindEvents();
    }
  };

  const stopScrubbing = () => {
    if (isSliding) {
      isSliding = false;
      setActive(false);
      unbindEvents();
      setTimeout(() => {
        typeof handlers?.onScrubEnd === "function" && handlers.onScrubEnd();
      }, 0);
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    startScrubbing();
    onMouseMove(event);
  };

  const onMouseMove = (event: MouseEvent) =>
    onScrub({ x: event.clientX, y: event.clientY });

  const onTouchStart = (event: TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    startScrubbing();
    onTouchMove(event);
  };

  const onTouchMove = (event: TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    onScrub({
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    });
  };

  onMount(() => {
    ref.addEventListener("mousedown", onMouseDown);
    ref.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });

    onCleanup(() => {
      if (ref) {
        ref.removeEventListener("mousedown", onMouseDown);
        ref.removeEventListener("touchstart", onTouchStart);
      }
    });
  });

  return { ref, active, setRef: (r) => (ref = r) };
}
