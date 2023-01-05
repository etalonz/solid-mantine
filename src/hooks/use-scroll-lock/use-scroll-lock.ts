import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { getLockStyles } from "./utils/get-lock-styles";
import { injectStyles } from "./utils/inject-style-tag";
import { insertStyleTag } from "./utils/insert-style-tag";
import { makeStyleTag } from "./utils/make-style-tag";

export function useScrollLock(
  lock?: Accessor<boolean>,
  options = {
    disableBodyPadding: false,
  }
) {
  const [scrollLocked, setScrollLocked] = createSignal(lock?.() || false);

  const { disableBodyPadding } = options;

  let stylesheet: CSSStyleSheet | any | null = null;

  const lockScroll = () => {
    const styles = getLockStyles({ disableBodyPadding });
    /**
     * by applying styles via style tag
     * we dont care about previous styles due to inheritance
     * when scroll gets unlocked we delete that style tag
     */
    const sheet = makeStyleTag();

    injectStyles(sheet, styles);
    insertStyleTag(sheet);

    stylesheet = sheet;
  };

  const unlockScroll = () => {
    if (!stylesheet) return;
    stylesheet.parentNode.removeChild(stylesheet);
    stylesheet = null;
  };

  createEffect(() => {
    if (scrollLocked()) lockScroll();
    else unlockScroll();

    onCleanup(unlockScroll);
  });

  createEffect(() => {
    if (lock?.() !== undefined) {
      setScrollLocked(lock());
    }
  });

  if (lock?.() === undefined && typeof window !== "undefined") {
    window.document.body.style.overflow === "hidden" && setScrollLocked(true);
  }

  return [scrollLocked, setScrollLocked] as const;
}
