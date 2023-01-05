import { JSXElement } from "solid-js";

export type ForwardRefWithStaticComponents<
  Props extends Record<string, any>,
  Static extends Record<string, any>
> = ((props: Props) => JSXElement) &
  Static & {
    displayName: string;
  };
