import { createStyles, MantineTheme } from "styles";
import type { TitleSize } from "./Title";
import { JSX } from "solid-js";

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface TitleStylesParams {
  element: HeadingElement;
  size: TitleSize;
  weight: JSX.CSSProperties["font-weight"];
  inline: boolean;
}

function getFontSize(
  size: TitleSize,
  element: HeadingElement,
  theme: MantineTheme
) {
  if (typeof size !== "undefined") {
    return size in theme.headings.sizes
      ? theme.headings.sizes[size].fontSize
      : size;
  }

  return theme.headings.sizes[element].fontSize;
}

function getLineHeight(
  size: TitleSize,
  element: HeadingElement,
  theme: MantineTheme
) {
  if (typeof size !== "undefined" && size in theme.headings.sizes) {
    return theme.headings.sizes[size].lineHeight;
  }

  return theme.headings.sizes[element].lineHeight;
}

export default createStyles(
  (theme, { element, weight, size, inline }: TitleStylesParams) => ({
    root: {
      ...theme.fn.fontStyles(),
      fontFamily: theme.headings.fontFamily,
      fontWeight:
        weight ||
        theme.headings.sizes[element].fontWeight ||
        theme.headings.fontWeight,
      fontSize: getFontSize(size, element, theme),
      lineHeight: inline ? 1 : getLineHeight(size, element, theme),
      margin: 0,
    },
  })
);
