import {
  useScrollLock,
  useFocusTrap,
  useFocusReturn,
  useId,
  useWindowEvent,
} from "hooks";
import {
  DefaultProps,
  MantineNumberSize,
  MantineShadow,
  Selectors,
  MantineStyleSystemSize,
  getDefaultZIndex,
  useComponentDefaultProps,
} from "styles";
import { CloseButton } from "../CloseButton";
import { Text } from "../Text";
import { Paper } from "../Paper";
import { Overlay } from "../Overlay";
import { OptionalPortal } from "../Portal";
import { Box } from "../Box";
import { GroupedTransition, MantineTransition } from "../Transition";
import useStyles, { ModalStylesParams } from "./Modal.styles";
import {
  ComponentProps,
  createEffect,
  createMemo,
  JSX,
  JSXElement,
  on,
  onCleanup,
  Show,
  splitProps,
} from "solid-js";

export type ModalStylesNames = Selectors<typeof useStyles>;

export interface ModalProps
  extends Omit<
      DefaultProps<ModalStylesNames, ModalStylesParams>,
      MantineStyleSystemSize
    >,
    Omit<ComponentProps<"div">, "title"> {
  /** Mounts modal if true */
  opened: boolean;

  /** Called when close button clicked and when escape key is pressed */
  onClose(): void;

  /** Modal title, displayed in header before close button */
  title?: JSXElement;

  /** Modal z-index property */
  zIndex?: JSX.CSSProperties["z-index"];

  /** Control vertical overflow behavior */
  overflow?: "outside" | "inside";

  /** Hides close button if set to false, modal still can be closed with escape key and by clicking outside */
  withCloseButton?: boolean;

  /** Overlay opacity */
  overlayOpacity?: number;

  /** Overlay color */
  overlayColor?: string;

  /** Overlay blur in px */
  overlayBlur?: number;

  /** Determines whether the modal should take the entire screen */
  fullScreen?: boolean;

  /** Modal radius */
  radius?: MantineNumberSize;

  /** Modal body width */
  size?: string | number;

  /** Modal body transition */
  transition?: MantineTransition;

  /** Duration in ms of modal transitions, set to 0 to disable all animations */
  transitionDuration?: number;

  /** Exit transition duration in ms, 0 by default */
  exitTransitionDuration?: number;

  /** Modal body transitionTimingFunction, defaults to theme.transitionTimingFunction */
  transitionTimingFunction?: string;

  /** Close button aria-label */
  closeButtonLabel?: string;

  /** id base, used to generate ids to connect modal title and body with aria- attributes, defaults to random id */
  id?: string;

  /** Modal shadow from theme or css value */
  shadow?: MantineShadow;

  /** Modal padding from theme or number value for padding in px */
  padding?: MantineNumberSize;

  /** Should modal be closed when outside click was registered? */
  closeOnClickOutside?: boolean;

  /** Should modal be closed when escape is pressed? */
  closeOnEscape?: boolean;

  /** Disables focus trap */
  trapFocus?: boolean;

  /** Controls if modal should be centered */
  centered?: boolean;

  /** Determines whether scroll should be locked when modal is opened, defaults to true */
  lockScroll?: boolean;

  /** Target element or selector where modal portal should be rendered */
  target?: HTMLElement | string;

  /** Determines whether modal should be rendered within Portal, defaults to true */
  withinPortal?: boolean;

  /** Determines whether focus should be returned to the last active element when drawer is closed */
  withFocusReturn?: boolean;
}

const defaultProps: Partial<ModalProps> = {
  size: "md",
  transitionDuration: 250,
  overflow: "outside",
  padding: "lg",
  shadow: "lg",
  closeOnClickOutside: true,
  closeOnEscape: true,
  trapFocus: true,
  withCloseButton: true,
  withinPortal: true,
  lockScroll: true,
  withFocusReturn: true,
  overlayBlur: 0,
  zIndex: getDefaultZIndex("modal"),
  exitTransitionDuration: 0,
};

export function Modal(props: ModalProps) {
  const [local, others] = splitProps(
    useComponentDefaultProps("Modal", defaultProps, props),
    [
      "className",
      "opened",
      "title",
      "onClose",
      "children",
      "withCloseButton",
      "overlayOpacity",
      "size",
      "transitionDuration",
      "exitTransitionDuration",
      "closeButtonLabel",
      "overlayColor",
      "overflow",
      "transition",
      "padding",
      "shadow",
      "radius",
      "id",
      "classNames",
      "styles",
      "closeOnClickOutside",
      "trapFocus",
      "closeOnEscape",
      "centered",
      "target",
      "withinPortal",
      "zIndex",
      "overlayBlur",
      "transitionTimingFunction",
      "fullScreen",
      "unstyled",
      "lockScroll",
      "withFocusReturn",
    ]
  );

  const baseId = useId(local.id);
  const titleId = `${baseId}-title`;
  const bodyId = `${baseId}-body`;
  const { classes, cx, theme } = useStyles(
    {
      size: local.size,
      overflow: local.overflow,
      centered: local.centered,
      zIndex: local.zIndex,
      fullScreen: local.fullScreen,
    },
    {
      unstyled: local.unstyled,
      classNames: local.classNames,
      styles: local.styles,
      name: "Modal",
    }
  );
  const focusTrapRef = useFocusTrap(() => local.trapFocus && local.opened);
  let overlayRef: HTMLDivElement = null;

  const _overlayOpacity = createMemo(() =>
    typeof local.overlayOpacity === "number"
      ? local.overlayOpacity
      : theme.colorScheme === "dark"
      ? 0.85
      : 0.75
  );

  useScrollLock(() => local.lockScroll && local.opened);

  const closeOnEscapePress = (event: KeyboardEvent) => {
    if (!local.trapFocus && event.key === "Escape" && local.closeOnEscape) {
      local.onClose();
    }
  };

  createEffect(
    on(
      () => local.trapFocus,
      (trap) => {
        if (!trap) {
          window.addEventListener("keydown", closeOnEscapePress);
          onCleanup(() =>
            window.removeEventListener("keydown", closeOnEscapePress)
          );
        }
      }
    )
  );

  useFocusReturn({
    opened: () => local.opened,
    shouldReturnFocus: local.trapFocus && local.withFocusReturn,
  });

  let clickTarget: EventTarget = null;

  useWindowEvent("mousedown", (e) => {
    clickTarget = e.target;
  });

  const handleOutsideClick = () => {
    if (clickTarget === overlayRef) {
      local.closeOnClickOutside && local.onClose();
    }
  };

  return (
    <OptionalPortal withinPortal={local.withinPortal} target={local.target}>
      <GroupedTransition
        mounted={local.opened}
        duration={local.transitionDuration}
        exitDuration={local.exitTransitionDuration}
        timingFunction={local.transitionTimingFunction}
        transitions={{
          modal: {
            duration: local.transitionDuration,
            transition: local.transition || (local.fullScreen ? "fade" : "pop"),
          },
          overlay: {
            duration: local.transitionDuration / 2,
            transition: "fade",
            timingFunction: "ease",
          },
        }}
      >
        {(transitionStyles) => (
          <>
            <Box
              id={baseId}
              className={cx(classes.root, local.className)}
              {...others}
            >
              <div style={transitionStyles.overlay}>
                <Overlay
                  className={classes.overlay}
                  sx={{ position: "fixed" }}
                  zIndex={0}
                  blur={local.overlayBlur}
                  color={
                    local.overlayColor ||
                    (theme.colorScheme === "dark"
                      ? theme.colors.dark[9]
                      : theme.black)
                  }
                  opacity={_overlayOpacity()}
                  unstyled={local.unstyled}
                />
              </div>
              <div
                role="presentation"
                class={classes.inner}
                onClick={handleOutsideClick}
                onKeyDown={(event) => {
                  const shouldTrigger =
                    (event.target as any)?.getAttribute(
                      "data-mantine-stop-propagation"
                    ) !== "true";
                  shouldTrigger &&
                    event.key === "Escape" &&
                    local.closeOnEscape &&
                    local.onClose();
                }}
                ref={(r) => {
                  focusTrapRef(r);
                  overlayRef = r;
                }}
              >
                <Paper<"div">
                  className={classes.modal}
                  shadow={local.shadow}
                  p={local.padding}
                  radius={local.radius}
                  role="dialog"
                  aria-labelledby={titleId}
                  aria-describedby={bodyId}
                  aria-modal
                  tabIndex={-1}
                  style={transitionStyles.modal}
                  unstyled={local.unstyled}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Show when={local.title || local.withCloseButton}>
                    <div class={classes.header}>
                      <Text id={titleId} className={classes.title}>
                        {local.title}
                      </Text>

                      <Show when={local.withCloseButton}>
                        <CloseButton
                          iconSize={16}
                          onClick={local.onClose}
                          aria-label={local.closeButtonLabel}
                          className={classes.close}
                        />
                      </Show>
                    </div>
                  </Show>

                  <div id={bodyId} class={classes.body}>
                    {local.children}
                  </div>
                </Paper>
              </div>
            </Box>
          </>
        )}
      </GroupedTransition>
    </OptionalPortal>
  );
}

Modal.displayName = "@mantine/core/Modal";
