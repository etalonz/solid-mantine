import { ComponentProps, JSX, Show, splitProps } from "solid-js";
import { Component, DefaultProps, useComponentDefaultProps } from "styles";
import { Text, TextProps } from "../Text";
import useStyles, { TitleStylesParams } from "./Title.styles";

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleSize = `h${TitleOrder}` | JSX.CSSProperties["font-size"];

export interface TitleProps
  extends Omit<TextProps, "size" | "styles" | "classNames">,
    DefaultProps<never, TitleStylesParams>,
    Omit<ComponentProps<"h1">, "color"> {
  /** Defines component and styles which will be used */
  order?: TitleOrder;

  /** Title font-size: h1-h6 or any valid CSS font-size value */
  size?: TitleSize;
}

const defaultProps: Partial<TitleProps> = {
  order: 1,
};

export const Title: Component<TitleProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Title", defaultProps, props),
    ["className", "order", "unstyled", "size", "weight", "inline"]
  );

  const { classes, cx } = useStyles(
    {
      element: `h${local.order}`,
      weight: local.weight,
      size: local.size,
      inline: local.inline,
    },
    { name: "Title", unstyled: local.unstyled }
  );

  return (
    <Show when={[1, 2, 3, 4, 5, 6].includes(local.order)}>
      <Text
        component={`h${local.order}`}
        className={cx(classes.root, local.className)}
        {...others}
      />
    </Show>
  );
};

Title.displayName = "@mantine/core/Title";
