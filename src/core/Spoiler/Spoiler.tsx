import {
  Component,
  DefaultProps,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { useElementSize } from "hooks";
import { Anchor } from "../Anchor";
import { Box } from "../Box";
import useStyles, { SpoilerStylesParams } from "./Spoiler.styles";
import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSXElement,
  splitProps,
} from "solid-js";

export type SpoilerStylesNames = Selectors<typeof useStyles>;

export interface SpoilerProps
  extends DefaultProps<SpoilerStylesNames, SpoilerStylesParams>,
    ComponentProps<"div"> {
  /** Max height of visible content, when this point is reached spoiler appears */
  maxHeight: number;

  /** Label for close spoiler action */
  hideLabel: JSXElement;

  /** Label for open spoiler action */
  showLabel: JSXElement;

  /** Get ref of spoiler toggle button */
  controlRef?: HTMLButtonElement;

  /** Initial spoiler state, true to wrap content in spoiler, false to show content without spoiler, opened state will be updated on mount */
  initialState?: boolean;

  /** Spoiler reveal transition duration in ms, 0 or null to turn off animation */
  transitionDuration?: number;
}

const defaultProps: Partial<SpoilerProps> = {
  maxHeight: 100,
  transitionDuration: 200,
  initialState: false,
};

export const Spoiler: Component<SpoilerProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Spoiler", defaultProps, props),
    [
      "className",
      "children",
      "maxHeight",
      "hideLabel",
      "showLabel",
      "transitionDuration",
      "controlRef",
      "initialState",
      "classNames",
      "styles",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    { transitionDuration: local.transitionDuration },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Spoiler",
    }
  );

  const [show, setShowState] = createSignal(local.initialState);
  const [spoiler, setSpoilerState] = createSignal(local.initialState);
  const { setObserverRef, height } = useElementSize();

  const spoilerMoreContent = createMemo(() =>
    show() ? local.hideLabel : local.showLabel
  );

  createEffect(() => {
    setSpoilerState(local.maxHeight < height());
  });

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      <div
        class={classes.content}
        style={{
          "max-height": !show()
            ? `${local.maxHeight}px`
            : `${height()}px` || undefined,
        }}
      >
        <div ref={setObserverRef}>{local.children}</div>
      </div>

      {spoiler() && (
        <Anchor
          component="button"
          ref={local.controlRef}
          onClick={() => setShowState((opened) => !opened)}
          className={classes.control}
        >
          {spoilerMoreContent()}
        </Anchor>
      )}
    </Box>
  );
};

Spoiler.displayName = "@mantine/core/Spoiler";
