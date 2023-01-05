import { useScrollLock, useFocusTrap, useFocusReturn } from "hooks";
import {
  DefaultProps,
  MantineNumberSize,
  MantineShadow,
  Selectors,
  MantineStyleSystemSize,
  getDefaultZIndex,
  useComponentDefaultProps,
} from "styles";
import { Paper } from "../Paper";
import { Overlay } from "../Overlay";
import { OptionalPortal } from "../Portal";
import { Text } from "../Text";
import { Box } from "../Box";
import { CloseButton } from "../CloseButton";
import { GroupedTransition, MantineTransition } from "../Transition";
import useStyles, { DrawerPosition } from "./Drawer.styles";
import {
  ComponentProps,
  createEffect,
  createMemo,
  JSX,
  JSXElement,
  onCleanup,
  Show,
  splitProps,
} from "solid-js";

export type DrawerStylesNames = Exclude<
  Selectors<typeof useStyles>,
  "withOverlay"
>;

export interface DrawerProps
  extends Omit<DefaultProps<DrawerStylesNames>, MantineStyleSystemSize>,
    Omit<ComponentProps<"div">, "title"> {
  /** If true drawer is mounted to the dom */
  opened: boolean;

  /** Called when drawer is closed (Escape key and click outside, depending on options) */
  onClose(): void;

  /** Drawer body position */
  position?: DrawerPosition;

  /** Drawer body width (right | left position) or height (top | bottom position), cannot exceed 100vh for height and 100% for width */
  size?: string | number;

  /** Drawer body shadow from theme or any css shadow value */
  shadow?: MantineShadow;

  /** Drawer body padding from theme or number for padding in px */
  padding?: MantineNumberSize;

  /** Drawer z-index property */
  zIndex?: JSX.CSSProperties["z-index"];

  /** Disables focus trap */
  trapFocus?: boolean;

  /** Disables scroll lock */
  lockScroll?: boolean;

  /** Disable onMouseDown trigger for outside events */
  closeOnClickOutside?: boolean;

  /** Disable onKeyDownCapture trigger for escape key press */
  closeOnEscape?: boolean;

  /** Drawer appear and disappear transition, see Transition component for full documentation */
  transition?: MantineTransition;

  /** Transition duration in ms */
  transitionDuration?: number;

  /** Drawer transitionTimingFunction css property */
  transitionTimingFunction?: string;

  /** Removes overlay entirely */
  withOverlay?: boolean;

  /** Overlay opacity, number from 0 to 1 */
  overlayOpacity?: number;

  /** Overlay color, for example, #000 */
  overlayColor?: string;

  /** Overlay blur in px */
  overlayBlur?: number;

  /** Drawer title, displayed in header before close button */
  title?: JSXElement;

  /** Hides close button if set to false, drawer still can be closed with escape key and by clicking outside */
  withCloseButton?: boolean;

  /** Close button aria-label */
  closeButtonLabel?: string;

  /** Target element or selector where drawer portal should be rendered */
  target?: HTMLElement | string;

  /** Determines whether drawer should be rendered within Portal, defaults to true */
  withinPortal?: boolean;

  /** Determines whether focus should be returned to the last active element when drawer is closed */
  withFocusReturn?: boolean;
}

const transitions: Record<DrawerPosition, MantineTransition> = {
  top: "slide-down",
  bottom: "slide-up",
  left: "slide-right",
  right: "slide-left",
};

const rtlTransitions: Record<DrawerPosition, MantineTransition> = {
  top: "slide-down",
  bottom: "slide-up",
  right: "slide-right",
  left: "slide-left",
};

const defaultProps: Partial<DrawerProps> = {
  position: "left",
  size: "md",
  transitionDuration: 250,
  transitionTimingFunction: "ease",
  zIndex: getDefaultZIndex("modal"),
  shadow: "md",
  padding: 0,
  lockScroll: true,
  closeOnClickOutside: true,
  closeOnEscape: true,
  trapFocus: true,
  withOverlay: true,
  withCloseButton: true,
  withinPortal: true,
  withFocusReturn: true,
  overlayBlur: 0,
};

export function Drawer(props: DrawerProps) {
  const [local, others] = splitProps(
    useComponentDefaultProps("Drawer", defaultProps, props),
    [
      "className",
      "opened",
      "onClose",
      "position",
      "size",
      "trapFocus",
      "lockScroll",
      "closeOnClickOutside",
      "closeOnEscape",
      "transition",
      "transitionDuration",
      "transitionTimingFunction",
      "zIndex",
      "overlayColor",
      "overlayOpacity",
      "children",
      "withOverlay",
      "shadow",
      "padding",
      "title",
      "withCloseButton",
      "closeButtonLabel",
      "classNames",
      "styles",
      "target",
      "withinPortal",
      "overlayBlur",
      "unstyled",
      "withFocusReturn",
    ]
  );

  const { classes, cx, theme } = useStyles(
    {
      size: local.size,
      position: local.position,
      zIndex: local.zIndex,
      withOverlay: local.withOverlay,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Drawer",
    }
  );

  const focusTrapRef = useFocusTrap(() => local.trapFocus && local.opened);

  const [, _lockScroll] = useScrollLock(() => local.lockScroll);

  const drawerTransition = createMemo(
    () =>
      local.transition ||
      (theme.dir === "rtl" ? rtlTransitions : transitions)[local.position]
  );

  const _overlayOpacity = createMemo(() =>
    typeof local.overlayOpacity === "number"
      ? local.overlayOpacity
      : theme.colorScheme === "dark"
      ? 0.85
      : 0.75
  );

  const _closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && local.closeOnEscape) {
      local.onClose();
    }
  };

  createEffect(() => {
    if (!local.trapFocus) {
      window.addEventListener("keydown", _closeOnEscape);
      onCleanup(() => window.removeEventListener("keydown", _closeOnEscape));
    }
  });

  useFocusReturn({
    opened: () => local.opened,
    shouldReturnFocus: local.trapFocus && local.withFocusReturn,
  });

  return (
    <OptionalPortal withinPortal={local.withinPortal} target={local.target}>
      <GroupedTransition
        onExited={() => _lockScroll(false)}
        onEntered={() => _lockScroll(local.lockScroll && true)}
        mounted={local.opened}
        duration={local.transitionDuration}
        timingFunction={local.transitionTimingFunction}
        transitions={{
          overlay: {
            duration: local.transitionDuration / 2,
            transition: "fade",
            timingFunction: "ease",
          },
          drawer: {
            duration: local.transitionDuration,
            transition: drawerTransition(),
            timingFunction: local.transitionTimingFunction,
          },
        }}
      >
        {(transitionStyles) => (
          <Box
            className={cx(classes.root, local.className)}
            role="dialog"
            aria-modal
            {...others}
          >
            <Paper<"div">
              className={cx(classes.drawer, local.className)}
              ref={focusTrapRef}
              style={transitionStyles.drawer}
              radius={0}
              tabIndex={-1}
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
              shadow={local.shadow}
              p={local.padding}
              unstyled={local.unstyled}
            >
              <Show when={local.title || local.withCloseButton}>
                <div class={classes.header}>
                  <Text className={classes.title} unstyled={local.unstyled}>
                    {local.title}
                  </Text>

                  <Show when={local.withCloseButton}>
                    <CloseButton
                      iconSize={16}
                      onClick={local.onClose}
                      aria-label={local.closeButtonLabel}
                      className={classes.closeButton}
                      unstyled={local.unstyled}
                    />
                  </Show>
                </div>
              </Show>

              {local.children}
            </Paper>

            <Show when={local.withOverlay}>
              <div style={transitionStyles.overlay}>
                <Overlay
                  unstyled={local.unstyled}
                  blur={local.overlayBlur}
                  onMouseDown={() =>
                    local.closeOnClickOutside && local.onClose()
                  }
                  className={classes.overlay}
                  opacity={_overlayOpacity()}
                  zIndex={0}
                  color={
                    local.overlayColor ||
                    (theme.colorScheme === "dark"
                      ? theme.colors.dark[9]
                      : theme.black)
                  }
                />
              </div>
            </Show>
          </Box>
        )}
      </GroupedTransition>
    </OptionalPortal>
  );
}

Drawer.displayName = "@mantine/core/Drawer";
