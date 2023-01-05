import { FOCUS_SELECTOR, focusable, tabbable } from "./tabbable";
import { scopeTab } from "./scope-tab";
import { createAriaHider } from "./create-aria-hider";
import { Accessor, createEffect, onCleanup } from "solid-js";

export function useFocusTrap(
  active: Accessor<boolean>
): (instance: HTMLElement | null) => void {
  let ref: HTMLElement | null = null;
  let restoreAria: Function | null = null;

  const setRef = (node: HTMLElement | null) => {
    ref = node;

    if (!active()) {
      return;
    }

    if (!node) {
      return;
    }

    restoreAria = createAriaHider(node);
    if (ref === node) {
      return;
    }

    if (node) {
      const processNode = () => {
        let focusElement: HTMLElement = node.querySelector("[data-autofocus]");

        if (!focusElement) {
          const children = Array.from<HTMLElement>(
            node.querySelectorAll(FOCUS_SELECTOR)
          );
          focusElement =
            children.find(tabbable) || children.find(focusable) || null;
          if (!focusElement && focusable(node)) focusElement = node;
        }

        if (focusElement) {
          focusElement.focus({ preventScroll: true });
        } else if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            "[@mantine/hooks/use-focus-trap] Failed to find focusable element within provided node",
            node
          );
        }
      };

      // Delay processing the HTML node by a frame. This ensures focus is assigned correctly.
      setTimeout(() => {
        if (node.ownerDocument) {
          processNode();
        } else if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            "[@mantine/hooks/use-focus-trap] Ref node is not part of the dom",
            node
          );
        }
      });
    }
  };

  createEffect(() => {
    if (!active()) {
      return;
    }

    // update when active changes
    setRef(ref);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && ref) {
        scopeTab(ref, event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);

      if (restoreAria) {
        restoreAria();
      }
    });
  });

  return setRef;
}
