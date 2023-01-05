import { useFocusTrap } from "hooks";
import { Ref } from "@solid-primitives/refs";
import { JSXElement } from "solid-js";

export interface FocusTrapProps {
  /** Element at which focus should be trapped, should support ref prop */
  children: any;

  /** Determines whether focus should be trapped within child element */
  active?: boolean;

  /** Prop that should be used to access component ref */
  refProp?: string;
}

export function FocusTrap(p: FocusTrapProps): JSXElement {
  const focusTrapRef = useFocusTrap(() => p.active);
  return (
    <Ref onMount={(e) => focusTrapRef(e as HTMLElement)}>{p.children}</Ref>
  );
}

FocusTrap.displayName = "@mantine/core/FocusTrap";
