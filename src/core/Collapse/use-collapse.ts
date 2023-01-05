import { mergeRefs } from "@solid-primitives/refs";
import {
  Accessor,
  createEffect,
  createSignal,
  JSX,
  on,
  onMount,
  Ref,
} from "solid-js";

function getAutoHeightDuration(height: number | string) {
  if (!height || typeof height === "string") {
    return 0;
  }
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function getElementHeight(el: HTMLElement) {
  return el ? el.scrollHeight : "auto";
}

export function getElementWidth(el: HTMLElement) {
  return el ? el.scrollWidth : "auto";
}

const raf = typeof window !== "undefined" && window.requestAnimationFrame;

interface UseCollapse {
  axis: "x" | "y";
  opened: Accessor<boolean>;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  onTransitionEnd?: () => void;
}

interface GetCollapseProps {
  [key: string]: unknown;
  style?: JSX.CSSProperties;
  onTransitionEnd?: (e: TransitionEvent) => void;
  ref?: Ref<HTMLDivElement>;
}

export function useCollapse({
  transitionDuration,
  transitionTimingFunction = "ease",
  onTransitionEnd = () => {},
  opened,
  axis,
}: UseCollapse): (props: GetCollapseProps) => Record<string, any> {
  let el: HTMLElement = null;

  const collapsedHeight = "0px";
  const [styles, setStylesRaw] = createSignal<JSX.CSSProperties>({});

  const setStyles = (newStyles: {} | ((oldStyles: {}) => {})): void => {
    setStylesRaw(newStyles);
  };

  const mergeStyles = (newStyles: {}): void => {
    setStyles((oldStyles) => ({ ...oldStyles, ...newStyles }));
  };

  function getTransitionStyles(height: number | string): {
    transition?: string;
    transitionProperty?: string;
    transitionDuration?: string;
    transitionTimingFunction?: string;
  } {
    const _duration = transitionDuration || getAutoHeightDuration(height);
    return {
      transitionProperty: `${axis === "x" ? "width" : "height"}`,
      transitionDuration: `${_duration}ms`,
      transitionTimingFunction: `${transitionTimingFunction}`,
    };
  }

  const getDefaultSizes = () => {
    const oldStyles = styles;
    setStyles({});
    const sizes = { width: getElementWidth(el), height: getElementHeight(el) };
    setStyles(oldStyles);
    return sizes;
  };

  const getCollapsedStyles = () => {
    const { height } = getDefaultSizes();
    return {
      x: { height, width: "0px", overflow: "hidden" },
      y: { display: "none", height: "0px", overflow: "hidden" },
    };
  };

  onMount(() => {
    raf(() => {
      const { x, y } = getCollapsedStyles();
      if (axis === "x" && !opened()) {
        setStyles({ ...x });
      } else if (axis === "y" && !opened()) {
        setStyles({ ...y });
      }
    });
  });

  // y axis
  createEffect(
    on(
      opened,
      (opened) => {
        if (axis === "x") return;

        if (opened) {
          raf(() => {
            mergeStyles({
              willChange: "height",
              display: "block",
              overflow: "hidden",
            });
            raf(() => {
              const height = getElementHeight(el);
              mergeStyles({ ...getTransitionStyles(height), height });
            });
          });
        } else {
          raf(() => {
            const height = getElementHeight(el);
            mergeStyles({
              ...getTransitionStyles(height),
              willChange: "height",
              height,
            });
            raf(() =>
              mergeStyles({ height: collapsedHeight, overflow: "hidden" })
            );
          });
        }
      },
      { defer: true }
    )
  );

  // x axis
  createEffect(
    on(
      opened,
      (opened) => {
        if (axis === "y") return;

        if (opened) {
          raf(() => {
            const { width } = getDefaultSizes();
            mergeStyles({
              display: "block",
              overflow: "hidden",
              willChange: "width",
              flexShrink: 0,
            });
            raf(() => {
              mergeStyles({ ...getTransitionStyles(width), width });
            });
          });
        } else {
          raf(() => {
            const { width, height } = getDefaultSizes();
            mergeStyles({
              ...getTransitionStyles(width),
              flexShrink: 0,
              willChange: "width",
              width,
              height,
            });
            raf(() => mergeStyles({ width: "0px", overflow: "hidden" }));
          });
        }
      },
      { defer: true }
    )
  );

  const handleTransitionEnd = (e: TransitionEvent): void => {
    if (e.target !== el || !(e.propertyName === "width" || "height")) {
      return;
    }

    onTransitionEnd();
    if (opened()) {
      setStyles({});
    } else {
      const { x, y } = getCollapsedStyles();
      if (axis === "x") setStyles(x);
      else setStyles(y);
    }
  };

  function getCollapseProps({
    style = {},
    ref,
    ...rest
  }: GetCollapseProps = {}) {
    console.log("calc props");
    return {
      "aria-hidden": !opened(),
      ...rest,
      ref: mergeRefs((r) => {
        el = r;
        console.log("set ref", el);
      }, ref),
      onTransitionEnd: handleTransitionEnd,
      style: { boxSizing: "border-box", ...style, ...styles() },
    };
  }

  return getCollapseProps;
}
