import { createContext, useContext } from "solid-js";

interface InputWrapperContextValue {
  offsetTop: boolean;
  offsetBottom: boolean;
}

const InputWrapperContext = createContext<InputWrapperContextValue>({
  offsetBottom: false,
  offsetTop: false,
});

export const InputWrapperProvider = InputWrapperContext.Provider;
export const useInputWrapperContext = () => useContext(InputWrapperContext);
