import { createContext, JSX, useContext } from "solid-js";

interface ChipGroupContextValue {
  isChipSelected(value: string): boolean;
  onChange: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
  multiple: boolean;
}

const ChipGroupContext = createContext<ChipGroupContextValue>(null);

export const ChipGroupProvider = ChipGroupContext.Provider;
export const useChipGroup = () => useContext(ChipGroupContext);
