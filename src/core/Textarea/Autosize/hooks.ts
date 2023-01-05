import { createEffect, onCleanup } from "solid-js";

export const useWindowResizeListener = (listener: (event: UIEvent) => any) => {
  createEffect(() => {
    window.addEventListener("resize", listener);
    onCleanup(() => {
      window.removeEventListener("resize", listener);
    });
  });
};
