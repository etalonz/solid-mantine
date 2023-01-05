import { Accessor } from "solid-js";
import { createSafeContext } from "utils";
import { ACCORDION_ERRORS } from "./Accordion.errors";

interface AccordionItemContext {
  value: Accessor<string>;
}

export const [AccordionItemContextProvider, useAccordionItemContext] =
  createSafeContext<AccordionItemContext>(ACCORDION_ERRORS.itemContext);
