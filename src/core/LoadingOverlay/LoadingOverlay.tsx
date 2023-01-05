import {
  DefaultProps,
  MantineNumberSize,
  getDefaultZIndex,
  useComponentDefaultProps,
  Component,
} from "styles";
import { Overlay } from "../Overlay";
import { Transition } from "../Transition";
import { Loader, LoaderProps } from "../Loader";
import { Box } from "../Box";
import useStyles from "./LoadingOverlay.styles";
import {
  ComponentProps,
  createMemo,
  JSX,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";

export interface LoadingOverlayProps
  extends DefaultProps,
    ComponentProps<"div"> {
  /** Provide custom loader */
  loader?: JSXElement;

  /** Loader component props */
  loaderProps?: LoaderProps;

  /** Sets overlay opacity */
  overlayOpacity?: number;

  /** Sets overlay color, defaults to theme.white in light theme and to theme.colors.dark[5] in dark theme */
  overlayColor?: string;

  /** Sets overlay blur in px */
  overlayBlur?: number;

  /** Loading overlay z-index */
  zIndex?: JSX.CSSProperties["z-index"];

  /** If visible overlay will take 100% width and height of first parent with relative position and overlay all of its content */
  visible: boolean;

  /** Animation duration in ms */
  transitionDuration?: number;

  /** Exit transition duration in ms */
  exitTransitionDuration?: number;

  /** Value from theme.radius or number to set border-radius in px */
  radius?: MantineNumberSize;
}

const defaultProps: Partial<LoadingOverlayProps> = {
  overlayOpacity: 0.75,
  transitionDuration: 0,
  zIndex: getDefaultZIndex("overlay"),
};

export const LoadingOverlay: Component<LoadingOverlayProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("LoadingOverlay", defaultProps, props),
    [
      "className",
      "visible",
      "loaderProps",
      "overlayOpacity",
      "overlayColor",
      "transitionDuration",
      "exitTransitionDuration",
      "zIndex",
      "style",
      "loader",
      "radius",
      "overlayBlur",
      "unstyled",
    ]
  );

  const { classes, cx, theme } = useStyles(null, {
    name: "LoadingOverlay",
    unstyled: local.unstyled,
  });
  const _zIndex = createMemo(() => `calc(${local.zIndex} + 1)` as any);

  return (
    <Transition
      duration={local.transitionDuration}
      exitDuration={local.exitTransitionDuration}
      mounted={local.visible}
      transition="fade"
    >
      <Box
        className={cx(classes.root, local.className)}
        style={{
          ...(local.style as JSX.CSSProperties),
          "z-index": local.zIndex,
        }}
        {...others}
      >
        <Show
          when={local.loader}
          fallback={() => (
            <Loader style={{ "z-index": _zIndex() }} {...local.loaderProps} />
          )}
        >
          <div style={{ "z-index": _zIndex() }}>{local.loader}</div>
        </Show>

        <Overlay
          opacity={local.overlayOpacity}
          zIndex={local.zIndex}
          radius={local.radius}
          blur={local.overlayBlur}
          unstyled={local.unstyled}
          color={
            local.overlayColor ||
            (theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white)
          }
        />
      </Box>
    </Transition>
  );
};

LoadingOverlay.displayName = "@mantine/core/LoadingOverlay";
