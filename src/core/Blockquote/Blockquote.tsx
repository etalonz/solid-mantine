import {
  Component,
  DefaultProps,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import { QuoteIcon } from "./QuoteIcon";
import useStyles, { BlockquoteStylesParams } from "./Blockquote.styles";
import { ComponentProps, JSXElement, splitProps } from "solid-js";

export type BlockquoteStylesNames = Selectors<typeof useStyles>;

export interface BlockquoteProps
  extends DefaultProps<BlockquoteStylesNames, BlockquoteStylesParams>,
    Omit<ComponentProps<"blockquote">, "cite"> {
  /** Icon color from theme */
  color?: MantineColor;

  /** Icon, defaults to quote icon */
  icon?: JSXElement;

  /** Describe a reference to a cited quote */
  cite?: JSXElement;
}

const defaultProps: Partial<BlockquoteProps> = {
  color: "gray",
  icon: <QuoteIcon />,
};

export const Blockquote: Component<BlockquoteProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Blockquote", defaultProps, props),
    [
      "className",
      "color",
      "icon",
      "cite",
      "children",
      "classNames",
      "styles",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    { color: local.color },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Blockquote",
    }
  );

  return (
    <Box
      component="blockquote"
      className={cx(classes.root, local.className)}
      {...others}
    >
      <div class={classes.inner}>
        {local.icon && <div class={classes.icon}>{local.icon}</div>}
        <div class={classes.body}>
          {local.children}
          {local.cite && <cite class={classes.cite}>{local.cite}</cite>}
        </div>
      </div>
    </Box>
  );
};

Blockquote.displayName = "@mantine/core/Blockquote";
