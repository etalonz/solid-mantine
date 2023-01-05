import {
  MantineColor,
  MantineTheme,
  CSSObject,
  useComponentDefaultProps,
  Component,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { Text, TextProps } from "../Text/Text";
import { Mark } from "../Mark/Mark";
import { highlighter } from "./highlighter/highlighter";
import { For, splitProps, Show } from "solid-js";

export interface HighlightProps extends TextProps {
  /** Substring or an array of substrings to highlight in children */
  highlight: string | string[];

  /** Color from theme that is used for highlighting */
  highlightColor?: MantineColor;

  /** Styles applied to highlighted part */
  highlightStyles?: CSSObject | ((theme: MantineTheme) => CSSObject);

  /** Full string part of which will be highlighted */
  children: string;
}

const defaultProps: Partial<HighlightProps> = {
  highlightColor: "yellow",
};

export const _Highlight: Component<HighlightProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Highlight", defaultProps, props),
    ["children", "highlight", "highlightColor", "highlightStyles", "unstyled"]
  );

  return (
    <Text unstyled={local.unstyled} {...others}>
      <For each={highlighter(local.children, local.highlight)}>
        {({ chunk, highlighted }) => (
          <Show when={highlighted} fallback={() => <span>{chunk}</span>}>
            <Mark
              unstyled={local.unstyled}
              color={local.highlightColor}
              sx={local.highlightStyles}
            >
              {chunk}
            </Mark>
          </Show>
        )}
      </For>
    </Text>
  );
};

_Highlight.displayName = "@mantine/core/Highlight";

export const Highlight = createPolymorphicComponent<"div", HighlightProps>(
  _Highlight
);
