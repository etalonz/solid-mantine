import { ComponentProps, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { createPolymorphicComponent, packSx } from "utils";
import { Box } from "../Box";

export interface BackgroundImageProps
  extends DefaultProps,
    ComponentProps<"div"> {
  /** Image url */
  src: string;

  /** Key of theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;
}

const defaultProps: Partial<BackgroundImageProps> = {
  radius: 0,
};

export const _BackgroundImage: Component<BackgroundImageProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("BackgroundImage", defaultProps, props),
    ["src", "radius", "sx"]
  );

  return (
    <Box
      {...others}
      sx={[
        (theme) => ({
          ...theme.fn.focusStyles(),
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "block",
          width: "100%",
          border: 0,
          textDecoration: "none",
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          backgroundImage: `url(${local.src})`,
          borderRadius: theme.fn.radius(local.radius),
        }),
        ...packSx(local.sx),
      ]}
    />
  );
};

_BackgroundImage.displayName = "@mantine/core/BackgroundImage";

export const BackgroundImage = createPolymorphicComponent<
  "div",
  BackgroundImageProps
>(_BackgroundImage);
