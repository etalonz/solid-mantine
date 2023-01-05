import { getDefaultZIndex, useComponentDefaultProps } from "styles";
import { Box } from "../../Box";
import { OptionalPortal } from "../../Portal";
import { TooltipBaseProps } from "../Tooltip.types";
import useStyles from "../Tooltip.styles";
import { useFloatingTooltip } from "./use-floating-tooltip";
import { children, JSX, Show, splitProps } from "solid-js";
import { toPx } from "utils";

export interface TooltipFloatingProps extends TooltipBaseProps {
  /** Offset from mouse in px */
  offset?: number;
}

const defaultProps: Partial<TooltipFloatingProps> = {
  refProp: "ref",
  withinPortal: true,
  offset: 10,
  position: "right",
  zIndex: getDefaultZIndex("popover"),
};

export function TooltipFloating(props: TooltipFloatingProps) {
  const [local, others] = splitProps(
    useComponentDefaultProps("TooltipFloating", defaultProps, props),
    [
      "children",
      "refProp",
      "withinPortal",
      "style",
      "className",
      "classNames",
      "styles",
      "unstyled",
      "radius",
      "color",
      "label",
      "offset",
      "position",
      "multiline",
      "width",
      "zIndex",
      "disabled",
    ]
  );

  const floatingTooltip = useFloatingTooltip({
    offset: () => local.offset,
    position: () => local.position,
  });

  const { classes, cx } = useStyles(
    {
      radius: local.radius,
      color: local.color,
      multiline: local.multiline,
      width: local.width,
    },
    {
      name: "Tooltip",
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );

  const onMouseEnter = (event: MouseEvent) => {
    floatingTooltip().handleMouseMove(event);
    floatingTooltip().setOpened(true);
  };

  const onMouseLeave = (event: MouseEvent) => {
    floatingTooltip().setOpened(false);
  };

  const Children = children(() => local.children);

  return (
    <Show when={!local.disabled} fallback={Children}>
      <OptionalPortal withinPortal={local.withinPortal}>
        <Box
          {...others}
          ref={floatingTooltip().floating.floating}
          className={cx(classes.tooltip, local.className)}
          style={{
            ...(local.style as JSX.CSSProperties),
            "z-index": local.zIndex,
            display: floatingTooltip().opened ? "block" : "none",
            top: toPx(floatingTooltip().y),
            left: toPx(Math.round(floatingTooltip().x)),
          }}
        >
          {local.label}
        </Box>
      </OptionalPortal>

      <div
        ref={(r) => (floatingTooltip().boundaryRef.current = r)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {Children}
      </div>
    </Show>
  );
}

TooltipFloating.displayName = "@mantine/core/TooltipFloating";
