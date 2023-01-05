import { Accessor, createEffect, on, onCleanup } from "solid-js";

interface UseFocusReturn {
  opened: Accessor<boolean>;
  shouldReturnFocus?: boolean;
}

/** Returns focus to last active element, used in Modal and Drawer */
export function useFocusReturn({
  opened,
  shouldReturnFocus = true,
}: UseFocusReturn) {
  let lastActiveElement: HTMLElement;

  const returnFocus = () => {
    if (
      lastActiveElement &&
      "focus" in lastActiveElement &&
      typeof lastActiveElement.focus === "function"
    ) {
      lastActiveElement?.focus({ preventScroll: true });
    }
  };

  createEffect(
    on(
      [opened, () => shouldReturnFocus],
      ([opened]) => {
        let timeout = -1;

        const clearFocusTimeout = (event: KeyboardEvent) => {
          if (event.key === "Tab") {
            window.clearTimeout(timeout);
          }
        };

        document.addEventListener("keydown", clearFocusTimeout);

        if (opened) {
          lastActiveElement = document.activeElement as HTMLElement;
        } else if (shouldReturnFocus) {
          timeout = window.setTimeout(returnFocus, 10);
        }

        onCleanup(() => {
          window.clearTimeout(timeout);
          document.removeEventListener("keydown", clearFocusTimeout);
        });
      },
      { defer: true }
    )
  );

  return returnFocus;
}
