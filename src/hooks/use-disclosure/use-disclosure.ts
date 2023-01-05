import { createSignal } from "solid-js";

export function useDisclosure(
  initialState: boolean,
  callbacks?: { onOpen?(): void; onClose?(): void }
) {
  const [opened, setOpened] = createSignal(initialState);

  const open = () => {
    if (!opened()) {
      setOpened(true);
      callbacks?.onOpen?.();
    }
  };

  const close = () => {
    if (opened()) {
      setOpened(false);
      callbacks?.onClose?.();
    }
  };

  const toggle = () => {
    opened() ? close() : open();
  };

  return [opened, { open, close, toggle }] as const;
}
