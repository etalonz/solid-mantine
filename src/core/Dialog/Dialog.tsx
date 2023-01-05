import {
  useMantineTheme,
  DefaultProps,
  Selectors,
  MantineStyleSystemSize,
  getDefaultZIndex,
  useComponentDefaultProps,
  ComponentWithRef,
} from "styles";
import { Transition, MantineTransition } from "../Transition";
import { CloseButton } from "../CloseButton";
import { Affix } from "../Affix";
import { Paper, PaperProps } from "../Paper";
import useStyles, { DialogStylesParams } from "./Dialog.styles";
import { JSX, JSXElement, Show, splitProps } from "solid-js";

export type DialogStylesNames = Selectors<typeof useStyles>;

export interface DialogProps
  extends Omit<
      DefaultProps<DialogStylesNames, DialogStylesParams>,
      MantineStyleSystemSize
    >,
    Omit<PaperProps, "classNames" | "styles"> {
  /** Display close button at the top right corner */
  withCloseButton?: boolean;

  /** Called when close button is clicked */
  onClose?(): void;

  /** Dialog position (fixed in viewport) */
  position?: {
    top?: string | number;
    left?: string | number;
    bottom?: string | number;
    right?: string | number;
  };

  /** Dialog content */
  children?: JSXElement;

  /** Dialog container z-index */
  zIndex?: JSX.CSSProperties["z-index"];

  /** Opened state */
  opened: boolean;

  /** Appear/disappear transition */
  transition?: MantineTransition;

  /** Duration in ms of modal transitions, set to 0 to disable all animations */
  transitionDuration?: number;

  /** Transition timing function, defaults to theme.transitionTimingFunction */
  transitionTimingFunction?: string;

  /** Predefined dialog width or number to set width in px */
  size?: string | number;
}

const defaultProps: Partial<DialogProps> = {
  shadow: "md",
  p: "md",
  withBorder: true,
  size: "md",
  transition: "pop-top-right",
  transitionDuration: 200,
};

export function DialogBody(props: DialogProps) {
  const [local, others] = splitProps(
    useComponentDefaultProps("Dialog", defaultProps, props),
    [
      "withCloseButton",
      "onClose",
      "position",
      "shadow",
      "children",
      "className",
      "style",
      "classNames",
      "styles",
      "opened",
      "withBorder",
      "size",
      "transition",
      "transitionDuration",
      "transitionTimingFunction",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    { size: local.size },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Dialog",
    }
  );

  return (
    <Transition
      mounted={local.opened}
      transition={local.transition}
      duration={local.transitionDuration}
      timingFunction={local.transitionTimingFunction}
    >
      <Paper
        className={cx(classes.root, local.className)}
        style={{ ...(local.style as JSX.CSSProperties) }}
        shadow={local.shadow}
        withBorder={local.withBorder}
        unstyled={local.unstyled}
        {...others}
      >
        <Show when={local.withCloseButton}>
          <CloseButton
            onClick={local.onClose}
            className={classes.closeButton}
          />
        </Show>

        {local.children}
      </Paper>
    </Transition>
  );
}

export const Dialog: ComponentWithRef<DialogProps, HTMLDivElement> = (
  props
) => {
  const [local, others] = splitProps(props, ["zIndex", "ref"]);
  const theme = useMantineTheme();

  return (
    <Affix
      zIndex={local.zIndex || getDefaultZIndex("modal")}
      position={
        props.position || {
          bottom: theme.spacing.xl,
          right: theme.spacing.xl,
        }
      }
      ref={local.ref}
    >
      <DialogBody {...props} />
    </Affix>
  );
};

Dialog.displayName = "@mantine/core/Dialog";
