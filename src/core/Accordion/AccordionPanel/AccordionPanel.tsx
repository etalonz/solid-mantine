import { ComponentProps, createMemo, ParentProps, splitProps } from "solid-js";
import { Selectors, DefaultProps, useContextStylesApi } from "styles";
import { Collapse } from "../../Collapse";
import { useAccordionContext } from "../Accordion.context";
import { useAccordionItemContext } from "../AccordionItem.context";
import useStyles from "./AccordionPanel.styles";

export type AccordionPanelStylesNames = Selectors<typeof useStyles>;

export interface AccordionPanelProps
  extends DefaultProps,
    ParentProps<Omit<ComponentProps<"div">, "onTransitionEnd">> {}

export function AccordionPanel(props: AccordionPanelProps) {
  const [local, others] = splitProps(props, ["children", "className"]);

  const ctx = useAccordionContext();
  const itemCtx = useAccordionItemContext();

  const { classNames, styles, unstyled } = useContextStylesApi();
  const { classes, cx } = useStyles(
    { variant: ctx.variant, radius: ctx.radius },
    { name: "Accordion", classNames, styles, unstyled }
  );

  return (
    <Collapse
      {...others}
      className={cx(classes.panel, local.className)}
      in={ctx.isItemActive(itemCtx.value())}
      transitionDuration={ctx.transitionDuration}
      role="region"
      id={ctx.getRegionId(itemCtx.value())}
      aria-labelledby={ctx.getControlId(itemCtx.value())}
    >
      <div class={classes.content}>{local.children}</div>
    </Collapse>
  );
}

AccordionPanel.displayName = "@mantine/core/AccordionPanel";
