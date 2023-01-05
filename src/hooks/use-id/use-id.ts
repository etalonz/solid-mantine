import { createUniqueId } from "solid-js";

const randomId = () => `mantine-${Math.random().toString(36).slice(2, 11)}`;

const useSolidId: () => string | undefined =
  createUniqueId || (() => undefined);

function useClientId() {
  return randomId();
}

function getSolidId() {
  const id = useSolidId();
  return id ? `mantine-${id.replace(/:/g, "")}` : "";
}

export function useId(staticId?: string) {
  return typeof staticId === "string"
    ? staticId
    : getSolidId() || useClientId();
}
