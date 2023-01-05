import { JSXElement } from "solid-js";
import { children as solidChildren } from "solid-js";

export function filterFalsyChildren(children: JSXElement) {
  return (solidChildren(() => children).toArray() as JSXElement[]).filter(
    Boolean
  );
}
