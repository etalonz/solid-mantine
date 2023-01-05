import { JSX } from "solid-js";
export function applyStyles(el: HTMLElement, styles: JSX.CSSProperties) {
  if (!el.style) {
    console.error("Element has no inline style object, not applying styles.");
    return;
  }
  for (const [property, value] of Object.entries(styles)) {
    el.style[property] = value;
  }
}
