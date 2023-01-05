import { MantineSize } from "styles";
import { Accessor, createContext, useContext } from "solid-js";

interface RadioGroupContextValue {
  size: MantineSize;
  value: Accessor<string>;
  onChange(event: any): void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue>(null);
export const RadioGroupProvider = RadioGroupContext.Provider;
export const useRadioGroupContext = () => useContext(RadioGroupContext);
