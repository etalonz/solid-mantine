import {
  createContextContainer,
  itSupportsSystemProps,
  itThrowsContextError,
  itRendersChildren,
  setupMatchMediaMock,
} from "testing";
import { AccordionPanel, AccordionPanelProps } from "./AccordionPanel";
import { AccordionProvider } from "../AccordionProvider";
import { AccordionItemContextProvider } from "../AccordionItem.context";
import { ACCORDION_ERRORS } from "../Accordion.errors";

const TestContainer = createContextContainer(
  createContextContainer(AccordionPanel, AccordionItemContextProvider, {
    value: () => ({ value: "test-value" }),
  }),
  AccordionProvider
);

const defaultProps: AccordionPanelProps = {};

describe("@mantine/core/AccordionPanel", () => {
  setupMatchMediaMock();
  itThrowsContextError(
    createContextContainer(AccordionPanel, AccordionItemContextProvider, {
      value: () => ({ value: "test-value" }),
    }),
    defaultProps,
    ACCORDION_ERRORS.context
  );

  itRendersChildren(TestContainer, defaultProps);
  itSupportsSystemProps({
    component: TestContainer,
    props: defaultProps,
    displayName: "@mantine/core/AccordionPanel",
  });
});
