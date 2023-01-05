import { MantineSize } from "styles";
import { Accessor, createContext, useContext } from "solid-js";

interface CheckboxGroupContextValue {
  value: Accessor<string[]>;
  onChange(event: InputEvent): void;
  size: MantineSize;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue>(null);
export const CheckboxGroupProvider = CheckboxGroupContext.Provider;
export const useCheckboxGroupContext = () => useContext(CheckboxGroupContext);
