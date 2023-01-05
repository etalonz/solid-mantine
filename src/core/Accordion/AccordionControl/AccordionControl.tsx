import {
  ComponentProps,
  createMemo,
  JSXElement,
  ParentProps,
  splitProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  useContextStylesApi,
  DefaultProps,
  Selectors,
  Component,
} from "styles";
import { createScopedKeydownHandler } from "utils";
import { UnstyledButton } from "../../UnstyledButton";
import { useAccordionContext } from "../Accordion.context";
import { useAccordionItemContext } from "../AccordionItem.context";
import useStyles from "./AccordionControl.styles";

export type AccordionControlStylesNames = Selectors<typeof useStyles>;

export interface AccordionControlProps
  extends DefaultProps,
    ParentProps<ComponentProps<"button">> {
  /** Disables control button */
  disabled?: boolean;

  /** Custom chevron icon */
  chevron?: JSXElement;

  /** Icon rendered next to label */
  icon?: JSXElement;
}

export const AccordionControl: Component<AccordionControlProps> = (props) => {
  const [local, others] = splitProps(props, [
    "disabled",
    "onKeyDown",
    "onClick",
    "chevron",
    "children",
    "className",
    "icon",
  ]);

  const ctx = useAccordionContext();
  const itemCtx = useAccordionItemContext();

  const { classNames, styles, unstyled } = useContextStylesApi();
  const { classes, cx } = useStyles(
    {
      transitionDuration: ctx.transitionDuration,
      chevronPosition: ctx.chevronPosition,
      chevronSize: ctx.chevronSize,
      variant: ctx.variant,
      radius: ctx.radius,
    },
    { name: "Accordion", classNames, styles, unstyled }
  );

  const isActive = createMemo(() => ctx.isItemActive(itemCtx.value()));
  const shouldWrapWithHeading = typeof ctx.order === "number";
  const Heading = `h${ctx.order}` as const;

  const content = (
    <UnstyledButton<"button">
      {...others}
      data-accordion-control
      disabled={local.disabled}
      className={cx(classes.control, local.className)}
      onClick={(event) => {
        (local.onClick as any)?.(event);
        ctx.onChange(itemCtx.value());
      }}
      type="button"
      data-active={isActive() || undefined}
      aria-expanded={isActive()}
      aria-controls={ctx.getRegionId(itemCtx.value())}
      id={ctx.getControlId(itemCtx.value())}
      unstyled={unstyled}
      onKeyDown={createScopedKeydownHandler({
        siblingSelector: "[data-accordion-control]",
        parentSelector: "[data-accordion]",
        activateOnFocus: false,
        loop: ctx.loop,
        orientation: "vertical",
        onKeyDown: local.onKeyDown as any,
      })}
    >
      <div
        class={classes.chevron}
        data-rotate={(!ctx.disableChevronRotation && isActive()) || undefined}
      >
        {local.chevron || ctx.chevron}
      </div>
      <div class={classes.label}>{local.children}</div>
      {local.icon && <div class={classes.icon}>{local.icon}</div>}
    </UnstyledButton>
  );

  return shouldWrapWithHeading ? (
    <Dynamic component={Heading} class={classes.itemTitle}>
      {content}
    </Dynamic>
  ) : (
    content
  );
};

AccordionControl.displayName = "@mantine/core/AccordionControl";
