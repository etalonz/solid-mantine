import { createContext, ParentProps, useContext } from "solid-js";
import type { EmotionCache } from "@emotion/cache";
import type { MantineThemeOverride, MantineTheme } from "./types";
import { DEFAULT_THEME } from "./default-theme";
import { mergeProps } from "solid-js";
import { mergeThemeWithFunctions } from "./utils/merge-theme/merge-theme";
import { NormalizeCSS } from "./NormalizeCSS";
import { GlobalStyles } from "./GlobalStyles";
import { MantineCssVariables } from "./MantineCssVariables";
import { Global, ThemeProvider } from "emotion";

interface MantineProviderContextType {
  theme: MantineTheme;
  emotionCache?: EmotionCache;
}

const MantineProviderContext = createContext<MantineProviderContextType>({
  theme: DEFAULT_THEME,
});

export function useMantineTheme() {
  return useContext(MantineProviderContext)?.theme || DEFAULT_THEME;
}

export function useMantineProviderStyles(component: string | string[]) {
  const theme = useMantineTheme();

  const getStyles = (name: string) => ({
    styles: theme.components[name]?.styles || {},
    classNames: theme.components[name]?.classNames || {},
  });

  if (Array.isArray(component)) {
    return component.map(getStyles);
  }

  return [getStyles(component)];
}

export function useMantineEmotionCache() {
  return useContext(MantineProviderContext)?.emotionCache;
}

export function useComponentDefaultProps<
  T extends Record<string, any>,
  U extends Partial<T> = {}
>(
  component: string,
  defaultProps: U,
  props: T
): [keyof U] extends [keyof T]
  ? T
  : {
      [Key in Exclude<keyof T, keyof U>]: T[Key];
    } & {
      [Key in Extract<keyof T, keyof U>]-?: U[Key] & T[Key];
    } {
  const theme = useMantineTheme();
  const contextProps = theme.components[component]?.defaultProps;
  return mergeProps(defaultProps, contextProps, props) as any;
}

export interface MantineProviderProps extends ParentProps {
  theme?: MantineThemeOverride;
  emotionCache?: EmotionCache;
  withNormalizeCSS?: boolean;
  withGlobalStyles?: boolean;
  withCSSVariables?: boolean;
  inherit?: boolean;
}

export function MantineProvider(props: MantineProviderProps) {
  const ctx = useContext(MantineProviderContext);
  const mergedTheme = mergeThemeWithFunctions(
    DEFAULT_THEME,
    props.inherit ? { ...ctx.theme, ...props.theme } : props.theme
  );

  return (
    <ThemeProvider theme={mergedTheme}>
      <MantineProviderContext.Provider
        value={{ theme: mergedTheme, emotionCache: props.emotionCache }}
      >
        {props.withNormalizeCSS && <NormalizeCSS />}
        {props.withGlobalStyles && <GlobalStyles theme={mergedTheme} />}
        {props.withCSSVariables && <MantineCssVariables theme={mergedTheme} />}
        {typeof mergedTheme.globalStyles === "function" && (
          <Global styles={mergedTheme.globalStyles(mergedTheme) as any} />
        )}
        {props.children}
      </MantineProviderContext.Provider>
    </ThemeProvider>
  );
}
