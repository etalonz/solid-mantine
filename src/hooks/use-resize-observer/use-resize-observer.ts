import { createEffect, createMemo, createSignal } from "solid-js";

type ObserverRect = Omit<DOMRectReadOnly, "toJSON">;

const defaultState: ObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

export function useResizeObserver<T extends HTMLElement = any>() {
  let frameID = 0;
  const [observerRef, setObserverRef] = createSignal<T>();
  const [rect, setRect] = createSignal<ObserverRect>(defaultState);

  const observer = createMemo(() =>
    typeof window !== "undefined"
      ? new ResizeObserver((entries: any) => {
          const entry = entries[0];

          if (entry) {
            cancelAnimationFrame(frameID);

            frameID = requestAnimationFrame(() => {
              if (observerRef()) {
                setRect(entry.contentRect);
              }
            });
          }
        })
      : null
  );

  createEffect(() => {
    if (observerRef()) {
      observer().observe(observerRef());
    }

    return () => {
      observer().disconnect();

      if (frameID) {
        cancelAnimationFrame(frameID);
      }
    };
  });

  return [observerRef, setObserverRef, rect] as const;
}

export function useElementSize<T extends HTMLElement = any>() {
  const [observerRef, setObserverRef, rect] = useResizeObserver<T>();
  return {
    observerRef,
    setObserverRef,
    widtH: createMemo(() => rect().width),
    height: createMemo(() => rect().height),
  };
}
