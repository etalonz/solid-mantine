import { ParentProps, JSX, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineGradient,
  useComponentDefaultProps,
  MantineColor,
  MantineNumberSize,
  ComponentWithRef,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { Box } from "../Box";
import useStyles from "./Text.styles";

export interface TextProps extends DefaultProps, ParentProps {
  /** Key of theme.fontSizes or number to set font-size in px */
  size?: MantineNumberSize;

  /** Key of theme.colors or any valid CSS color */
  color?: "dimmed" | MantineColor;

  /** Sets font-weight css property */
  weight?: JSX.CSSProperties["font-weight"];

  /** Sets text-transform css property */
  transform?: JSX.CSSProperties["text-transform"];

  /** Sets text-align css property */
  align?: JSX.CSSProperties["text-align"];

  /** Link or text variant */
  variant?: "text" | "link" | "gradient";

  /** CSS -webkit-line-clamp property */
  lineClamp?: number;

  /** Sets line-height to 1 for centering */
  inline?: boolean;

  /** Underline the text */
  underline?: boolean;

  /** Add strikethrough styles */
  strikethrough?: boolean;

  /** Adds font-style: italic style */
  italic?: boolean;

  /** Inherit font properties from parent element */
  inherit?: boolean;

  /** Controls gradient settings in gradient variant only */
  gradient?: MantineGradient;

  /** Shorthand for component="span" */
  span?: boolean;
}

const defaultProps: Partial<TextProps> = {
  variant: "text",
};

export const _Text: ComponentWithRef<TextProps, HTMLDivElement> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Text", defaultProps, props),
    [
      "className",
      "size",
      "weight",
      "transform",
      "color",
      "align",
      "variant",
      "lineClamp",
      "gradient",
      "inline",
      "inherit",
      "underline",
      "strikethrough",
      "italic",
      "classNames",
      "styles",
      "unstyled",
      "span",
    ]
  );

  const { classes, cx } = useStyles(
    {
      variant: local.variant,
      color: local.color,
      size: local.size,
      lineClamp: local.lineClamp,
      inline: local.inline,
      inherit: local.inherit,
      underline: local.underline,
      strikethrough: local.strikethrough,
      italic: local.italic,
      weight: local.weight,
      transform: local.transform,
      align: local.align,
      gradient: local.gradient,
    },
    { unstyled: local.unstyled, name: "Text" }
  );

  return (
    <Box
      className={cx(
        classes.root,
        { [classes.gradient]: local.variant === "gradient" },
        local.className
      )}
      component={local.span ? "span" : "div"}
      {...others}
    />
  );
};

_Text.displayName = "@mantine/core/Text";

export const Text = createPolymorphicComponent<"div", TextProps>(_Text);
