import { useReducedMotion } from "hooks";
import {
  children,
  ComponentProps,
  createMemo,
  JSX,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";
import {
  Component,
  DefaultProps,
  useComponentDefaultProps,
  useMantineTheme,
} from "styles";
import { Box, extractSystemStyles } from "../Box";
import { useCollapse } from "./use-collapse";

export interface CollapseProps extends DefaultProps, ComponentProps<"div"> {
  /** Content that should be collapsed */
  children: JSXElement;

  /** Opened state */
  in: boolean;

  /** Called each time transition ends */
  onTransitionEnd?: () => void;

  /** Transition duration in ms */
  transitionDuration?: number;

  /** Transition timing function */
  transitionTimingFunction?: string;

  /** Should opacity be animated */
  animateOpacity?: boolean;

  /** Axis of collapse  */
  axis?: "x" | "y";
}

const defaultProps: Partial<CollapseProps> = {
  transitionDuration: 200,
  transitionTimingFunction: "ease",
  animateOpacity: true,
  axis: "y",
};

export const Collapse: Component<CollapseProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Collapse", defaultProps, props),
    [
      "ref",
      "children",
      "in",
      "transitionDuration",
      "transitionTimingFunction",
      "style",
      "onTransitionEnd",
      "animateOpacity",
      "axis",
    ]
  );

  const theme = useMantineTheme();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const duration = reduceMotion ? 0 : local.transitionDuration;

  const { systemStyles, rest } = extractSystemStyles(others);

  const getCollapseProps = useCollapse({
    opened: () => local.in,
    transitionDuration: duration,
    transitionTimingFunction: local.transitionTimingFunction,
    onTransitionEnd: local.onTransitionEnd,
    axis: local.axis,
  });

  const Children = children(() => local.children);

  return (
    <Show
      when={duration > 0}
      fallback={
        <Show when={local.in}>
          <Box {...rest}>{Children}</Box>
        </Show>
      }
    >
      <Box
        {...getCollapseProps({
          style: local.style as JSX.CSSProperties,
          ref: local.ref,
          ...rest,
          ...systemStyles,
        })}
      >
        <div
          style={{
            opacity: local.in || !local.animateOpacity ? 1 : 0,
            transition: local.animateOpacity
              ? `opacity ${duration}ms ${local.transitionTimingFunction}`
              : "none",
          }}
        >
          {Children}
        </div>
      </Box>
    </Show>
  );
};

Collapse.displayName = "@mantine/core/Collapse";
