import { ParentProps, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
  Selectors,
  ComponentWithRef,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { Box } from "../Box";
import useStyles, { ColorSwatchStylesParams } from "./ColorSwatch.styles";

export type ColorSwatchStylesNames = Selectors<typeof useStyles>;

export interface ColorSwatchProps
  extends ParentProps<
    DefaultProps<ColorSwatchStylesNames, ColorSwatchStylesParams>
  > {
  /** Swatch color value in any css valid format (hex, rgb, etc.) */
  color: string;

  /** Width, height and border-radius in px */
  size?: number;

  /** Swatch border-radius predefined from theme or number for px value */
  radius?: MantineNumberSize;

  /**  Determines whether swatch should have inner shadow */
  withShadow?: boolean;
}

const defaultProps: Partial<ColorSwatchProps> = {
  size: 25,
  radius: 25,
  withShadow: true,
};

export const _ColorSwatch: ComponentWithRef<
  ColorSwatchProps,
  HTMLDivElement
> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("ColorSwatch", defaultProps, props),
    [
      "color",
      "size",
      "radius",
      "className",
      "children",
      "classNames",
      "styles",
      "unstyled",
      "withShadow",
    ]
  );
  const { classes, cx } = useStyles(
    { radius: local.radius, size: local.size },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "ColorSwatch",
    }
  );

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      <div class={cx(classes.alphaOverlay, classes.overlay)} />
      {local.withShadow && (
        <div class={cx(classes.shadowOverlay, classes.overlay)} />
      )}
      <div
        class={classes.overlay}
        style={{ "background-color": local.color }}
      />
      <div class={cx(classes.children, classes.overlay)}>{local.children}</div>
    </Box>
  );
};

_ColorSwatch.displayName = "@mantine/core/ColorSwatch";

export const ColorSwatch = createPolymorphicComponent<"div", ColorSwatchProps>(
  _ColorSwatch
);
