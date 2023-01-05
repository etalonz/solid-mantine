import { type EmotionCache } from "@emotion/utils";

import { useContext, createContext, JSX, Component } from "solid-js";

import createCache from "@emotion/cache";
import { isBrowser } from "./utils";

let EmotionCacheContext = /* #__PURE__ */ createContext(
  // we're doing this to avoid preconstruct's dead code elimination in this one case
  // because this module is primarily intended for the browser and node
  // but it's also required in react native and similar environments sometimes
  // and we could have a special build just for that
  // but this is much easier and the native packages
  // might use a different theme context in the future anyway
  typeof HTMLElement !== "undefined"
    ? /* #__PURE__ */ createCache({ key: "css" })
    : null
);

export let CacheProvider = EmotionCacheContext.Provider;

let withEmotionCache: <Props>(
  f: (p: Props, cache: EmotionCache) => JSX.Element
) => Component<Props>;

if (isBrowser) {
  withEmotionCache = function <Props>(
    func: (props: Props, cache: EmotionCache) => JSX.Element
  ) {
    return (props: Props) => {
      const cache = useContext(EmotionCacheContext);
      return func(props, cache!);
    };
  };
} else {
  withEmotionCache = function <Props>(
    func: (props: Props, cache: EmotionCache) => JSX.Element
  ): Component<Props> {
    return (props: Props) => {
      let cache = useContext(EmotionCacheContext);
      if (cache === null) {
        cache = createCache({ key: "css" });
        return (
          <EmotionCacheContext.Provider value={cache}>
            {func(props, cache)}
          </EmotionCacheContext.Provider>
        );
      } else {
        return func(props, cache);
      }
    };
  };
}

export { withEmotionCache };
