import { createContext, JSXElement, useContext } from "solid-js";
import weakMemoize from "@emotion/weak-memoize";

export const ThemeContext = createContext({});

type ThemeObjectOrFunction = Object | ((o: Object) => Object);

export interface ThemeProviderProps {
  theme: ThemeObjectOrFunction;
  children: JSXElement;
}

const getTheme = (outerTheme: Object, theme: ThemeObjectOrFunction) => {
  if (typeof theme === "function") {
    const mergedTheme = theme(outerTheme);
    if (
      process.env.NODE_ENV !== "production" &&
      (mergedTheme == null ||
        typeof mergedTheme !== "object" ||
        Array.isArray(mergedTheme))
    ) {
      throw new Error(
        "[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!"
      );
    }
    return mergedTheme;
  }
  if (
    process.env.NODE_ENV !== "production" &&
    (theme == null || typeof theme !== "object" || Array.isArray(theme))
  ) {
    throw new Error(
      "[ThemeProvider] Please make your theme prop a plain object"
    );
  }

  return { ...outerTheme, ...theme };
};

const createCacheWithTheme = /* #__PURE__ */ weakMemoize((outerTheme) => {
  return weakMemoize((theme) => {
    return getTheme(outerTheme, theme);
  });
});

export const ThemeProvider = (props: ThemeProviderProps) => {
  let theme = useContext(ThemeContext);
  if (props.theme !== theme) {
    theme = createCacheWithTheme(theme)(props.theme);
  }
  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  );
};
