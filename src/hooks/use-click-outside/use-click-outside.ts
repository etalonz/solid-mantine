import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";

const DEFAULT_EVENTS = ["mousedown", "touchstart"];

export function useClickOutside<T extends HTMLElement = any>(
  handler: () => void,
  events?: string[] | null,
  nodes?: Accessor<HTMLElement>[]
) {
  const [ref, setRef] = createSignal<T>();

  createEffect(() => {
    const listener = (event: any) => {
      const { target } = event ?? {};
      if (Array.isArray(nodes)) {
        const shouldIgnore =
          target?.hasAttribute("data-ignore-outside-clicks") ||
          !document.body.contains(target);
        const shouldTrigger = nodes.every(
          (node) => !!node() && !node().contains(target)
        );
        shouldTrigger && !shouldIgnore && handler();
      } else if (ref() && !ref().contains(target)) {
        handler();
      }
    };

    (events || DEFAULT_EVENTS).forEach((fn) =>
      document.addEventListener(fn, listener)
    );

    onCleanup(() => {
      (events || DEFAULT_EVENTS).forEach((fn) =>
        document.removeEventListener(fn, listener)
      );
    });
  });

  return [ref, setRef];
}
