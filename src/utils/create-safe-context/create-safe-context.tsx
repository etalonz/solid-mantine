import { createContext, JSXElement, useContext } from "solid-js";

export function createSafeContext<ContextValue>(errorMessage: string) {
  const Context = createContext<ContextValue | null>(null);

  const useSafeContext = () => {
    const ctx = useContext(Context);

    if (ctx === null) {
      throw new Error(errorMessage);
    }

    return ctx;
  };

  const Provider = (p: { value: ContextValue; children: JSXElement }) => {
    return <Context.Provider value={p.value}>{p.children}</Context.Provider>;
  };

  return [Provider, useSafeContext] as const;
}
