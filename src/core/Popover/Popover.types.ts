import { Selectors } from "styles";
import useStyles from "./PopoverDropdown/PopoverDropdown.styles";
import { JSX } from "solid-js";

export type { PopoverStylesParams } from "./PopoverDropdown/PopoverDropdown.styles";

export type PopoverStylesNames = Selectors<typeof useStyles>;

export type PopoverWidth = "target" | JSX.CSSProperties["width"];

export interface PopoverMiddlewares {
  shift: boolean;
  flip: boolean;
  inline?: boolean;
}
