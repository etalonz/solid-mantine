import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  useComponentDefaultProps,
  Component,
} from "styles";
import useStyles from "./Divider.styles";
import { Text } from "../Text";
import { Box } from "../Box";
import { ComponentProps, JSXElement, splitProps } from "solid-js";

export type DividerStylesNames = "label";

export interface DividerProps
  extends DefaultProps<DividerStylesNames>,
    ComponentProps<"div"> {
  /** Line color from theme, defaults to gray in light color scheme and to dark in dark color scheme */
  color?: MantineColor;

  /** Line orientation */
  orientation?: "horizontal" | "vertical";

  /** Sets height in horizontal orientation and width in vertical */
  size?: MantineNumberSize;

  /** Adds text after line in horizontal orientation */
  label?: JSXElement;

  /** Label position */
  labelPosition?: "left" | "center" | "right";

  /** Props spread to Text component in label */
  labelProps?: Record<string, any>;

  /** Divider borderStyle */
  variant?: "solid" | "dashed" | "dotted";
}

const defaultProps: Partial<DividerProps> = {
  orientation: "horizontal",
  size: "xs",
  labelPosition: "left",
  variant: "solid",
};

export const Divider: Component<DividerProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Divider", defaultProps, props),
    [
      "className",
      "color",
      "orientation",
      "size",
      "label",
      "labelPosition",
      "labelProps",
      "variant",
      "styles",
      "classNames",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    { color: local.color, size: local.size, variant: local.variant },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Divider",
    }
  );

  const vertical = local.orientation === "vertical";
  const horizontal = local.orientation === "horizontal";
  const withLabel = !!local.label && horizontal;

  const useLabelDefaultStyles = !local.labelProps?.color;

  return (
    <Box
      className={cx(
        classes.root,
        {
          [classes.vertical]: vertical,
          [classes.horizontal]: horizontal,
          [classes.withLabel]: withLabel,
        },
        local.className
      )}
      role="separator"
      {...others}
    >
      {withLabel && (
        <Text
          {...local.labelProps}
          size={local.labelProps?.size || "xs"}
          sx={{ marginTop: 2 }}
          className={cx(classes.label, classes[local.labelPosition], {
            [classes.labelDefaultStyles]: useLabelDefaultStyles,
          })}
        >
          {local.label}
        </Text>
      )}
    </Box>
  );
};

Divider.displayName = "@mantine/core/Divider";
