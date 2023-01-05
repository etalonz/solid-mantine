import { withEmotionCache } from "./context";
import { serializeStyles } from "@emotion/serialize";
import { insertStyles } from "@emotion/utils";
import { useContext, createEffect } from "solid-js";
import { ThemeContext } from "./theming";
import { isBrowser } from "./utils";

type Styles = Object | Array<Object>;

type GlobalProps = {
  styles: Styles | ((o: Object) => Styles);
};

export let Global = withEmotionCache<GlobalProps>((props, cache) => {
  let styles = props.styles;

  let serialized = serializeStyles(
    [styles],
    undefined,
    useContext(ThemeContext)
  );

  if (!isBrowser) {
    let serializedNames = serialized.name;
    let serializedStyles = serialized.styles;
    let next = serialized.next;
    while (next !== undefined) {
      serializedNames += " " + next.name;
      serializedStyles += next.styles;
      next = next.next;
    }

    let shouldCache = cache.compat === true;

    let rules = cache.insert(
      ``,
      { name: serializedNames, styles: serializedStyles },
      cache.sheet,
      shouldCache
    );

    if (shouldCache) {
      return null;
    }

    return (
      <style
        {...{
          [`data-emotion`]: `${cache.key}-global ${serializedNames}`,
          dangerouslySetInnerHTML: { __html: rules },
          nonce: cache.sheet.nonce,
        }}
      />
    );
  }

  // yes, i know these hooks are used conditionally
  // but it is based on a constant that will never change at runtime
  // it's effectively like having two implementations and switching them out
  // so it's not actually breaking anything

  let sheetRef: StyleSheet | null | [StyleSheet, boolean] = null;

  createEffect(() => {
    const key = `${cache.key}-global`;

    // use case of https://github.com/emotion-js/emotion/issues/2675
    let sheet = new cache.sheet.constructor({
      key,
      nonce: cache.sheet.nonce,
      container: cache.sheet.container,
      speedy: cache.sheet.isSpeedy,
    });
    let rehydrating = false;
    // $FlowFixMe
    let node: HTMLStyleElement | null = document.querySelector(
      `style[data-emotion="${key} ${serialized.name}"]`
    );
    if (cache.sheet.tags.length) {
      sheet.before = cache.sheet.tags[0];
    }
    if (node !== null) {
      rehydrating = true;
      // clear the hash so this node won't be recognizable as rehydratable by other <Global/>s
      node.setAttribute("data-emotion", key);
      sheet.hydrate([node]);
    }
    sheetRef = [sheet, rehydrating];
    return () => {
      sheet.flush();
    };
  });

  createEffect(() => {
    let [sheet, rehydrating] = sheetRef;
    if (rehydrating) {
      sheetRef[1] = false;
      return;
    }
    if (serialized.next !== undefined) {
      // insert keyframes
      insertStyles(cache, serialized.next, true);
    }

    if (sheet.tags.length) {
      // if this doesn't exist then it will be null so the style element will be appended
      let element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
      sheet.before = element;
      sheet.flush();
    }
    cache.insert(``, serialized, sheet, false);
  });

  return null;
});
