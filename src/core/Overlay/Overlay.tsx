import {
  MantineNumberSize,
  DefaultProps,
  getDefaultZIndex,
  useComponentDefaultProps,
  ComponentWithRef,
} from "styles";
import { createPolymorphicComponent, packSx } from "utils";
import { Box } from "../Box";
import useStyles, { OverlayStylesParams } from "./Overlay.styles";
import { JSX, Show, splitProps } from "solid-js";

export interface OverlayProps extends DefaultProps<never, OverlayStylesParams> {
  /** Overlay opacity */
  opacity?: JSX.CSSProperties["opacity"];

  /** Overlay background-color */
  color?: JSX.CSSProperties["background-color"];

  /** Overlay background blur in px */
  blur?: number;

  /** Use gradient instead of background-color */
  gradient?: string;

  /** Overlay z-index */
  zIndex?: JSX.CSSProperties["z-index"];

  /** Value from theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;
}

const defaultProps: Partial<OverlayProps> = {
  opacity: 0.6,
  color: "#fff",
  zIndex: getDefaultZIndex("modal"),
  radius: 0,
  blur: 0,
};

export const _Overlay: ComponentWithRef<OverlayProps, HTMLDivElement> = (
  props
) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Overlay", defaultProps, props),
    [
      "ref",
      "opacity",
      "blur",
      "color",
      "gradient",
      "zIndex",
      "radius",
      "sx",
      "unstyled",
      "className",
    ]
  );

  const { classes, cx } = useStyles(
    { zIndex: local.zIndex },
    { name: "Overlay", unstyled: local.unstyled }
  );
  const background = local.gradient
    ? { backgroundImage: local.gradient }
    : { backgroundColor: local.color };

  const InnerOverlay = (otherProps?: Record<string, any>) => (
    <Box
      ref={local.ref}
      className={cx(classes.root, local.className)}
      sx={[
        (theme) => ({
          ...background,
          opacity: local.opacity,
          borderRadius: theme.fn.size({
            size: local.radius,
            sizes: theme.radius,
          }),
        }),
        ...packSx(local.sx),
      ]}
      {...otherProps}
    />
  );

  return (
    <Show when={local.blur} fallback={() => <InnerOverlay {...others} />}>
      <Box
        className={cx(classes.root, local.className)}
        sx={[{ backdropFilter: `blur(${local.blur}px)` }, ...packSx(local.sx)]}
        {...others}
      >
        <InnerOverlay />
      </Box>
    </Show>
  );
};

_Overlay.displayName = "@mantine/core/Overlay";

export const Overlay = createPolymorphicComponent<"div", OverlayProps>(
  _Overlay
);
