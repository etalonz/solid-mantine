import { MantineSize } from "styles";
import { Accessor, createContext, useContext } from "solid-js";

interface SwitchGroupContextValue {
  value: Accessor<string[]>;
  onChange(event: any): void;
  size: MantineSize;
}

const SwitchGroupContext = createContext<SwitchGroupContextValue>(null);
export const SwitchGroupProvider = SwitchGroupContext.Provider;
export const useSwitchGroupContext = () => useContext(SwitchGroupContext);
