import type { MantineStyleSystemProps } from "./MantineStyleSystem";
import type { MantineTheme } from "./MantineTheme";
import type { CSSObject } from "../../tss";
import { Component as SolidComponent, JSX, Ref } from "solid-js";

export type Sx = CSSObject | ((theme: MantineTheme) => CSSObject);

export type ClassNames<StylesNames extends string> = Partial<
  Record<StylesNames, string>
>;
export type Styles<
  StylesNames extends string,
  StylesParams extends Record<string, any> = never
> =
  | Partial<Record<StylesNames, CSSObject>>
  | ((
      theme: MantineTheme,
      params: StylesParams
    ) => Partial<Record<StylesNames, CSSObject>>);

export interface DefaultProps<
  StylesNames extends string = never,
  StylesParams extends Record<string, any> = Record<string, any>
> extends MantineStyleSystemProps {
  className?: string;
  style?: JSX.CSSProperties | string;
  sx?: Sx | (Sx | undefined)[];
  classNames?: ClassNames<StylesNames>;
  styles?: Styles<StylesNames, StylesParams>;
  unstyled?: boolean;
}

export type Component<P> = SolidComponent<P> & { displayName?: string };
export type ComponentWithRef<P, R> = Component<P & { ref?: Ref<R> }>;
