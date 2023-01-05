import { createSignal } from "solid-js";

export function useInterval(fn: () => void, interval: number) {
  const [active, setActive] = createSignal(false);
  let intervalRef: number;

  const start = () => {
    setActive((old) => {
      if (!old && !intervalRef) {
        intervalRef = window.setInterval(fn, interval);
      }
      return true;
    });
  };

  const stop = () => {
    setActive(false);
    window.clearInterval(intervalRef);
    intervalRef = undefined;
  };

  const toggle = () => {
    if (active()) {
      stop();
    } else {
      start();
    }
  };

  return { start, stop, toggle, active };
}
