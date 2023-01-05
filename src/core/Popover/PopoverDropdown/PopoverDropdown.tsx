import { DefaultProps, useContextStylesApi } from "styles";
import { closeOnEscape, toPx } from "utils";
import { useFocusReturn } from "hooks";
import { FloatingArrow } from "../../Floating";
import { Box } from "../../Box";
import { Transition } from "../../Transition";
import { FocusTrap } from "../../FocusTrap";
import { OptionalPortal } from "../../Portal";
import { usePopoverContext } from "../Popover.context";
import useStyles from "./PopoverDropdown.styles";
import {
  ComponentProps,
  createSignal,
  JSX,
  ParentProps,
  Show,
  splitProps,
} from "solid-js";

export interface PopoverDropdownProps
  extends DefaultProps,
    ParentProps<ComponentProps<"div">> {}

export function PopoverDropdown(props: PopoverDropdownProps) {
  const [local, others] = splitProps(props, [
    "style",
    "className",
    "children",
    "onKeyDown",
  ]);

  const { classNames, styles, unstyled, staticSelector } =
    useContextStylesApi();
  const ctx = usePopoverContext();

  const { classes, cx } = useStyles(
    { radius: ctx.radius, shadow: ctx.shadow },
    { name: staticSelector, classNames, styles, unstyled }
  );

  const returnFocus = useFocusReturn({
    opened: ctx.opened,
    shouldReturnFocus: ctx.returnFocus,
  });

  const accessibleProps:
    | {
        role: JSX.AriaAttributes["role"];
        id: string;
        "aria-labelledby": string;
      }
    | {} = ctx.withRoles
    ? {
        "aria-labelledby": ctx.getTargetId(),
        id: ctx.getDropdownId(),
        role: "dialog",
      }
    : {};

  const [trapFocus, setTrapFocus] = createSignal(
    ctx.trapFocus() && ctx.opened()
  );

  return (
    <Show when={!ctx.disabled}>
      <OptionalPortal withinPortal={ctx.withinPortal}>
        <Transition
          onEntered={() => setTrapFocus(ctx.trapFocus())}
          onExit={() => setTrapFocus(false)}
          mounted={ctx.opened()}
          transition={ctx.transition}
          duration={ctx.transitionDuration}
          exitDuration={
            typeof ctx.exitTransitionDuration === "number"
              ? ctx.exitTransitionDuration
              : ctx.transitionDuration
          }
        >
          <FocusTrap active={trapFocus()}>
            <Box
              {...accessibleProps}
              tabIndex={-1}
              ref={ctx.floating}
              style={{
                ...(local.style as JSX.CSSProperties),
                "z-index": ctx.zIndex,
                top: toPx(ctx.y()),
                left: toPx(ctx.x()),
                width: ctx.width === "target" ? undefined : ctx.width,
              }}
              className={cx(classes.dropdown, local.className)}
              onKeyDown={closeOnEscape(ctx.onClose, {
                active: ctx.closeOnEscape,
                onTrigger: returnFocus,
                onKeyDown: local.onKeyDown as any,
              })}
              data-position={ctx.placement()}
              {...others}
            >
              {local.children}

              <FloatingArrow
                ref={ctx.setArrowRef}
                arrowX={ctx.arrowX()}
                arrowY={ctx.arrowY()}
                visible={ctx.withArrow}
                withBorder
                position={ctx.placement()}
                arrowSize={ctx.arrowSize}
                arrowRadius={ctx.arrowRadius}
                arrowOffset={ctx.arrowOffset}
                class={classes.arrow}
              />
            </Box>
          </FocusTrap>
        </Transition>
      </OptionalPortal>
    </Show>
  );
}

PopoverDropdown.displayName = "@mantine/core/PopoverDropdown";
