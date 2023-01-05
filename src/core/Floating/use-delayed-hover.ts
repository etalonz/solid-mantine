import { onCleanup } from "solid-js";

interface UseDelayedHoverInput {
  open(): void;
  close(): void;
  openDelay: number;
  closeDelay: number;
}

export function useDelayedHover({
  open,
  close,
  openDelay,
  closeDelay,
}: UseDelayedHoverInput) {
  let openTimeout = -1;
  let closeTimeout = -1;

  const clearTimeouts = () => {
    window.clearTimeout(openTimeout);
    window.clearTimeout(closeTimeout);
  };

  const openDropdown = () => {
    clearTimeouts();

    if (openDelay === 0) {
      open();
    } else {
      openTimeout = window.setTimeout(open, openDelay);
    }
  };

  const closeDropdown = () => {
    clearTimeouts();

    if (closeDelay === 0) {
      close();
    } else {
      closeTimeout = window.setTimeout(close, closeDelay);
    }
  };

  onCleanup(() => clearTimeouts());

  return { openDropdown, closeDropdown };
}
