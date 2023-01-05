import { createSignal } from "solid-js";

export function useHovered() {
  const [hovered, setHovered] = createSignal(-1);
  const resetHovered = () => setHovered(-1);
  return [hovered, { setHovered, resetHovered }] as const;
}
