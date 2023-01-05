import {
  Component,
  DefaultProps,
  Selectors,
  useContextStylesApi,
} from "styles";
import { Box } from "../../Box";
import { AccordionItemContextProvider } from "../AccordionItem.context";
import useStyles from "./AccordionItem.styles";
import { useAccordionContext } from "../Accordion.context";
import { ComponentProps, splitProps } from "solid-js";

export type AccordionItemStylesNames = Selectors<typeof useStyles>;

export interface AccordionItemProps
  extends DefaultProps<AccordionItemStylesNames>,
    ComponentProps<"div"> {
  /** Value that is used to manage accordion state */
  value: string;
}

export const AccordionItem: Component<AccordionItemProps> = (props) => {
  const [local, others] = splitProps(props, ["className", "value"]);
  const { classNames, styles, unstyled } = useContextStylesApi();
  const ctx = useAccordionContext();
  const { classes, cx } = useStyles(
    { variant: ctx.variant, radius: ctx.radius },
    { name: "Accordion", classNames, styles, unstyled }
  );

  return (
    <AccordionItemContextProvider value={{ value: () => local.value }}>
      <Box
        className={cx(classes.item, local.className)}
        data-active={ctx.isItemActive(local.value) || undefined}
        {...others}
      />
    </AccordionItemContextProvider>
  );
};

AccordionItem.displayName = "@mantine/core/AccordionItem";
