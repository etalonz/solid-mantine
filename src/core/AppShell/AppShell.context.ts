import { createContext, useContext, JSX } from "solid-js";

interface AppShellContextValue {
  zIndex?: JSX.CSSProperties["z-index"];
  fixed?: boolean;
}

const AppShellContext = createContext<AppShellContextValue>({});
export const AppShellProvider = AppShellContext.Provider;

export function useAppShellContext() {
  return useContext(AppShellContext);
}
