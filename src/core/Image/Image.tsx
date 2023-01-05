import {
  Component,
  DefaultProps,
  MantineNumberSize,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { Text } from "../Text";
import { Box } from "../Box";
import { ImageIcon } from "./ImageIcon";
import useStyles, { ImageStylesParams } from "./Image.styles";
import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  JSXElement,
  on,
  Ref,
  splitProps,
} from "solid-js";

export type ImageStylesNames = Selectors<typeof useStyles>;

export interface ImageProps
  extends DefaultProps<ImageStylesNames, ImageStylesParams>,
    Omit<ComponentProps<"div">, "placeholder"> {
  /** Image src */
  src?: string | null;

  /** Image alt text, used as title for placeholder if image was not loaded */
  alt?: string;

  /** Image object-fit property */
  fit?: JSX.CSSProperties["object-fit"];

  /** Image width, defaults to 100%, cannot exceed 100% */
  width?: string;

  /** Image height, defaults to original image height adjusted to given width */
  height?: string;

  /** Predefined border-radius value from theme.radius or number for border-radius in px */
  radius?: MantineNumberSize;

  /** Enable placeholder when image is loading and when image fails to load */
  withPlaceholder?: boolean;

  /** Customize placeholder content */
  placeholder?: JSXElement;

  /** Props spread to img element */
  imageProps?: Omit<ComponentProps<"img">, "ref">;

  /** Get image element ref */
  imageRef?: Ref<HTMLImageElement>;

  /** Image figcaption, displayed below image */
  caption?: JSXElement;
}

const defaultProps: Partial<ImageProps> = {
  fit: "cover",
  width: "100%",
  height: "auto",
  radius: 0,
};

export const Image: Component<ImageProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Image", defaultProps, props),
    [
      "className",
      "alt",
      "src",
      "fit",
      "width",
      "height",
      "radius",
      "imageProps",
      "withPlaceholder",
      "placeholder",
      "imageRef",
      "classNames",
      "styles",
      "caption",
      "unstyled",
      "style",
    ]
  );

  const { classes, cx } = useStyles(
    { radius: local.radius },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Image",
    }
  );

  const [loaded, setLoaded] = createSignal(!!local.src);
  const [error, setError] = createSignal(!local.src);
  const isPlaceholder = createMemo(
    () => local.withPlaceholder && (!loaded() || error())
  );

  createEffect(
    on(
      () => local.src,
      () => {
        setLoaded(false);
        setError(false);
      },
      { defer: true }
    )
  );

  return (
    <Box
      className={cx(classes.root, local.className)}
      style={{ width: local.width, ...(local.style as JSX.CSSProperties) }}
      {...others}
    >
      <figure class={classes.figure}>
        <div class={classes.imageWrapper}>
          <img
            class={classes.image}
            src={local.src}
            alt={local.alt}
            style={{
              "object-fit": local.fit,
              width: local.width,
              height: local.height,
            }}
            ref={local.imageRef}
            onLoad={(event) => {
              setLoaded(true);
              typeof local.imageProps?.onLoad === "function" &&
                local.imageProps.onLoad(event);
            }}
            onError={(event) => {
              setError(true);
              typeof local.imageProps?.onError === "function" &&
                local.imageProps.onError(event);
            }}
            {...local.imageProps}
          />

          {isPlaceholder() && (
            <div class={classes.placeholder} title={local.alt}>
              {local.placeholder || (
                <div>
                  <ImageIcon style={{ width: "40px", height: "40px" }} />
                </div>
              )}
            </div>
          )}
        </div>

        {!!local.caption && (
          <Text
            component="figcaption"
            size="sm"
            align="center"
            className={classes.caption}
          >
            {local.caption}
          </Text>
        )}
      </figure>
    </Box>
  );
};

Image.displayName = "@mantine/core/Image";
