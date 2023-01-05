import { createContext, JSXElement, splitProps, useContext } from "solid-js";

interface StylesApiContextValue {
  classNames: Record<string, string>;
  styles: Record<string, any>;
  unstyled: boolean;
  staticSelector?: string;
}

const StylesApiContext = createContext<StylesApiContextValue>({
  classNames: {},
  styles: {},
  unstyled: false,
});

export function StylesApiProvider(
  p: StylesApiContextValue & { children: JSXElement }
) {
  return (
    <StylesApiContext.Provider
      value={{
        classNames: p.classNames,
        styles: p.styles,
        unstyled: p.unstyled,
        staticSelector: p.staticSelector,
      }}
    >
      {p.children}
    </StylesApiContext.Provider>
  );
}

export function useContextStylesApi() {
  return useContext(StylesApiContext);
}
