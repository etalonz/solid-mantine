import { Accessor, createContext, JSXElement, useContext } from "solid-js";
import { ColorScheme } from "./types";

interface ColorSchemeContextProps {
  colorScheme: Accessor<ColorScheme>;
  toggleColorScheme(colorScheme?: ColorScheme): void;
}

const ColorSchemeContext = createContext<ColorSchemeContextProps>(null);

export function useMantineColorScheme() {
  const ctx = useContext(ColorSchemeContext);

  if (!ctx) {
    throw new Error(
      "useMantineColorScheme hook was called outside of context, make sure your app is wrapped with ColorSchemeProvider component"
    );
  }

  return ctx;
}

interface ColorSchemeProviderProps extends ColorSchemeContextProps {
  children: JSXElement;
}

export function ColorSchemeProvider({
  colorScheme,
  toggleColorScheme,
  children,
}: ColorSchemeProviderProps) {
  return (
    <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

ColorSchemeProvider.displayName = "@mantine/core/ColorSchemeProvider";
