import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
  MantineGradient,
  ComponentWithRef,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { Box } from "../Box";
import { AvatarPlaceholderIcon } from "./AvatarPlaceholderIcon";
import { AvatarGroup } from "./AvatarGroup/AvatarGroup";
import { useAvatarGroupContext } from "./AvatarGroup/AvatarGroup.context";
import useStyles, { AvatarStylesParams, AvatarVariant } from "./Avatar.styles";
import { createEffect, createSignal, ParentProps, splitProps } from "solid-js";

export type AvatarStylesNames = Selectors<typeof useStyles>;

export interface AvatarProps
  extends ParentProps<DefaultProps<AvatarStylesNames, AvatarStylesParams>> {
  /** Image url */
  src?: string | null;

  /** Image alt text or title for placeholder variant */
  alt?: string;

  /** Avatar width and height */
  size?: MantineNumberSize;

  /** Value from theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Color from theme.colors used for letter and icon placeholders */
  color?: MantineColor;

  /** Controls appearance */
  variant?: AvatarVariant;

  /** Controls gradient settings in gradient variant only */
  gradient?: MantineGradient;

  /** img element attributes */
  imageProps?: Record<string, any>;
}

const defaultProps: Partial<AvatarProps> = {
  size: "md",
  color: "gray",
  variant: "light",
};

export const _Avatar: ComponentWithRef<AvatarProps, HTMLDivElement> = (
  props
) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Avatar", defaultProps, props),
    [
      "className",
      "size",
      "src",
      "alt",
      "radius",
      "children",
      "color",
      "variant",
      "gradient",
      "classNames",
      "styles",
      "imageProps",
      "unstyled",
    ]
  );

  const ctx = useAvatarGroupContext();
  const [error, setError] = createSignal(!local.src);

  const { classes, cx } = useStyles(
    {
      color: local.color,
      radius: local.radius,
      size: local.size,
      withinGroup: ctx.withinGroup,
      spacing: ctx.spacing,
      variant: local.variant,
      gradient: local.gradient,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Avatar",
    }
  );

  createEffect(() => {
    if (!local.src) setError(true);
    else setError(false);
  });

  return (
    <Box
      component="div"
      className={cx(classes.root, local.className)}
      {...others}
    >
      {error() ? (
        <div class={classes.placeholder} title={local.alt}>
          {local.children || (
            <AvatarPlaceholderIcon class={classes.placeholderIcon} />
          )}
        </div>
      ) : (
        <img
          {...local.imageProps}
          class={classes.image}
          src={local.src}
          alt={local.alt}
          onError={() => setError(true)}
        />
      )}
    </Box>
  );
};

_Avatar.displayName = "@mantine/core/Avatar";
(_Avatar as any).Group = AvatarGroup;

export const Avatar = createPolymorphicComponent<
  "div",
  AvatarProps,
  { Group: typeof AvatarGroup }
>(_Avatar);
