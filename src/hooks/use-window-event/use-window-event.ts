import { onCleanup, onMount } from "solid-js";

export function useWindowEvent<K extends string>(
  type: K,
  listener: K extends keyof WindowEventMap
    ? (this: Window, ev: WindowEventMap[K]) => void
    : (this: Window, ev: CustomEvent) => void,
  options?: boolean | AddEventListenerOptions
) {
  onMount(() => window.addEventListener(type, listener, options));
  onCleanup(() => window.removeEventListener(type, listener, options));
}
