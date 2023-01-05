import {
  ComponentObject,
  ForwardRefWithStaticComponents,
  inspectChildren,
  isComponentObject,
  toPx,
} from "utils";
import { Component, getDefaultZIndex, useComponentDefaultProps } from "styles";
import { TooltipGroup } from "./TooltipGroup/TooltipGroup";
import { TooltipFloating } from "./TooltipFloating/TooltipFloating";
import { useTooltip } from "./use-tooltip";
import {
  FloatingArrow,
  getFloatingPosition,
  FloatingPosition,
} from "../Floating";
import { MantineTransition, Transition } from "../Transition";
import { OptionalPortal } from "../Portal";
import { Box } from "../Box";
import { TooltipBaseProps } from "./Tooltip.types";
import useStyles from "./Tooltip.styles";
import { TOOLTIP_ERRORS } from "./Tooltip.errors";
import { JSX, splitProps, createMemo } from "solid-js";
import { createComponent } from "solid-js/web";
import { mergeRefs } from "@solid-primitives/refs";

export interface TooltipProps extends TooltipBaseProps {
  /** Called when tooltip position changes */
  onPositionChange?(position: FloatingPosition): void;

  /** Open delay in ms */
  openDelay?: number;

  /** Close delay in ms */
  closeDelay?: number;

  /** Controls opened state */
  opened?: boolean;

  /** Space between target element and tooltip in px */
  offset?: number;

  /** Determines whether component should have an arrow */
  withArrow?: boolean;

  /** Arrow size in px */
  arrowSize?: number;

  /** Arrow offset in px */
  arrowOffset?: number;

  arrowRadius?: number;

  /** One of premade transitions ot transition object */
  transition?: MantineTransition;

  /** Transition duration in ms */
  transitionDuration?: number;

  /** Determines which events will be used to show tooltip */
  events?: { hover: boolean; focus: boolean; touch: boolean };

  /** useEffect dependencies to force update tooltip position */
  positionDependencies?: any[];

  /** Set if tooltip is attached to an inline element */
  inline?: boolean;
}

const defaultProps: Partial<TooltipProps> = {
  position: "top",
  refProp: "ref",
  withinPortal: false,
  inline: false,
  arrowSize: 4,
  arrowOffset: 5,
  offset: 5,
  transition: "fade",
  transitionDuration: 100,
  width: "auto",
  events: { hover: true, focus: false, touch: false },
  zIndex: getDefaultZIndex("popover"),
  positionDependencies: [],
};

const _Tooltip: Component<TooltipProps> = (props) => {
  const arrowRef: { current: HTMLDivElement | null } = { current: null };
  const [local, others] = splitProps(
    useComponentDefaultProps("Tooltip", defaultProps, props),
    [
      "ref",
      "children",
      "position",
      "refProp",
      "label",
      "openDelay",
      "closeDelay",
      "onPositionChange",
      "opened",
      "withinPortal",
      "radius",
      "color",
      "classNames",
      "styles",
      "unstyled",
      "style",
      "className",
      "withArrow",
      "arrowSize",
      "arrowOffset",
      "arrowRadius",
      "offset",
      "transition",
      "transitionDuration",
      "multiline",
      "width",
      "events",
      "zIndex",
      "disabled",
      "positionDependencies",
      "onClick",
      "onMouseEnter",
      "onMouseLeave",
      "inline",
    ]
  );

  const { classes, cx, theme } = useStyles(
    {
      radius: local.radius,
      color: local.color,
      width: local.width,
      multiline: local.multiline,
    },
    {
      name: "Tooltip",
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );

  const tooltip = useTooltip({
    position: () => getFloatingPosition(theme.dir, local.position),
    closeDelay: local.closeDelay,
    openDelay: local.openDelay,
    onPositionChange: local.onPositionChange,
    opened: () => local.opened,
    events: local.events,
    arrowRef,
    offset: local.offset + (local.withArrow ? local.arrowSize / 2 : 0),
    positionDependencies: [...local.positionDependencies],
    inline: local.inline,
  });

  const Children = inspectChildren(() => local.children);

  const target = createMemo(() => {
    if (!isComponentObject(Children()[0])) {
      throw new Error(TOOLTIP_ERRORS.children);
    }
    const { Component, props } = Children()[0] as ComponentObject;
    return { Component, props };
  });

  return (
    <>
      <OptionalPortal withinPortal={local.withinPortal}>
        <Transition
          mounted={!local.disabled && tooltip().opened()}
          transition={local.transition}
          duration={/*tooltip.isGroupPhase ? 10 :*/ local.transitionDuration}
        >
          <Box
            {...others}
            /* {...tooltip.getFloatingProps({
                ref: tooltip.floating,
                className: classes.tooltip,
                style: {
                  ...style,
                  ...transitionStyles,
                  zIndex,
                  top: tooltip.y ?? "",
                  left: tooltip.x ?? "",
                },
              })}*/

            ref={tooltip().floating}
            className={classes.tooltip}
            style={{
              ...(local.style as JSX.CSSProperties),
              "z-index": local.zIndex,
              top: toPx(tooltip().y),
              left: toPx(tooltip().x),
            }}
          >
            {local.label}

            <FloatingArrow
              ref={arrowRef.current}
              arrowX={tooltip().arrowX}
              arrowY={tooltip().arrowY}
              visible={local.withArrow}
              withBorder={false}
              position={tooltip().placement}
              arrowSize={local.arrowSize}
              arrowOffset={local.arrowOffset}
              arrowRadius={local.arrowRadius}
              class={classes.arrow}
            />
          </Box>
        </Transition>
      </OptionalPortal>

      {/* cloneElement(
        children,
        tooltip.getReferenceProps({
          onClick,
          onMouseEnter,
          onMouseLeave,
          [refProp]: targetRef,
          className: cx(className, children.props.className),
          ...children.props,
        })
      )*/}

      {createComponent(target().Component, {
        ref: mergeRefs(tooltip().reference, target().props.ref),
        onMouseEnter: () => tooltip().setUncontrolledOpened(true),
        onMouseLeave: () => tooltip().setUncontrolledOpened(false),
        class: cx(local.className, target().props.className),
        ...target().props,
      })}
    </>
  );
};

_Tooltip.displayName = "@mantine/core/Tooltip";

const __Tooltip = _Tooltip as any;

__Tooltip.Group = TooltipGroup;
__Tooltip.Floating = TooltipFloating;

export const Tooltip: ForwardRefWithStaticComponents<
  TooltipProps,
  { Group: typeof TooltipGroup; Floating: typeof TooltipFloating }
> = __Tooltip;
