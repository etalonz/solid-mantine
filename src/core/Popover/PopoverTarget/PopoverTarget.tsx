import { mergeRefs } from "@solid-primitives/refs";
import { splitProps, Ref, createMemo, JSXElement } from "solid-js";
import { createComponent } from "solid-js/web";
import { clsx, Component } from "styles";
import { inspectChildren, isComponentObject } from "utils";
import { usePopoverContext } from "../Popover.context";
import { POPOVER_ERRORS } from "../Popover.errors";

export interface PopoverTargetProps {
  /** Target element */
  children: JSXElement;

  /** Key of the prop that should be used to get element ref */
  refProp?: string;

  /** Popup accessible type, 'dialog' by default */
  popupType?: string;

  ref?: Ref<any>;

  __childrenProps?: any;
}

export const PopoverTarget: Component<PopoverTargetProps> = (props) => {
  const [local, others] = splitProps(props, [
    "children",
    "popupType",
    "ref",
    "__childrenProps",
  ]);
  const ctx = usePopoverContext();

  const accessibleProps = createMemo(() =>
    ctx.withRoles
      ? {
          "aria-haspopup": local.popupType || "dialog",
          "aria-expanded": ctx.opened(),
          "aria-controls": ctx.getDropdownId(),
          id: ctx.getTargetId(),
        }
      : {}
  );

  const Children = inspectChildren(() => local.children);

  const child = createMemo(() => {
    const first = Children()[0];
    if (!isComponentObject(first)) throw new Error(POPOVER_ERRORS.children);

    return createComponent(first.Component, {
      ...first.props,
      ...local.__childrenProps,
      ...others,
      ...accessibleProps(),
      ...ctx.targetProps,
      className: clsx(
        ctx.targetProps.className,
        (others as any).className,
        first.props.className
      ),
      ref: mergeRefs(ctx.reference, first.props.ref),
      ...(!ctx.controlled ? { onClick: ctx.onToggle } : null),
    });
  });

  return child();
};

PopoverTarget.displayName = "@mantine/core/PopoverTarget";
