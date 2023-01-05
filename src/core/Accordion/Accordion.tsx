import {
  DefaultProps,
  useComponentDefaultProps,
  StylesApiProvider,
} from "styles";
import { Box } from "../Box";
import { AccordionProviderProps, AccordionProvider } from "./AccordionProvider";
import {
  AccordionItem,
  AccordionItemStylesNames,
} from "./AccordionItem/AccordionItem";
import {
  AccordionControl,
  AccordionControlStylesNames,
} from "./AccordionControl/AccordionControl";
import {
  AccordionPanel,
  AccordionPanelStylesNames,
} from "./AccordionPanel/AccordionPanel";
import { ChevronIcon } from "./ChevronIcon";
import { AccordionStylesParams } from "./Accordion.types";
import { ComponentProps, splitProps } from "solid-js";

export type AccordionStylesNames =
  | AccordionItemStylesNames
  | AccordionPanelStylesNames
  | AccordionControlStylesNames;

export interface AccordionProps<Multiple extends boolean = false>
  extends AccordionProviderProps<Multiple>,
    DefaultProps<AccordionStylesNames, AccordionStylesParams>,
    Omit<
      ComponentProps<"div">,
      keyof AccordionProviderProps<Multiple> | "ref"
    > {}

const defaultProps: Partial<AccordionProps> = {
  multiple: false,
  disableChevronRotation: false,
  transitionDuration: 200,
  chevronPosition: "right",
  variant: "default",
  chevronSize: 24,
  chevron: () => <ChevronIcon />,
};

export function Accordion<Multiple extends boolean = false>(
  props: AccordionProps<Multiple>
) {
  const [local, others] = splitProps(
    useComponentDefaultProps<AccordionProps<Multiple>>(
      "Accordion",
      defaultProps as AccordionProps<Multiple>,
      props
    ),
    [
      "id",
      "loop",
      "children",
      "multiple",
      "value",
      "defaultValue",
      "onChange",
      "transitionDuration",
      "disableChevronRotation",
      "chevronPosition",
      "chevronSize",
      "order",
      "chevron",
      "classNames",
      "styles",
      "unstyled",
      "variant",
      "radius",
    ]
  );

  return (
    <AccordionProvider
      id={local.id}
      multiple={local.multiple}
      value={local.value}
      defaultValue={local.defaultValue}
      onChange={local.onChange}
      loop={local.loop}
      transitionDuration={local.transitionDuration}
      disableChevronRotation={local.disableChevronRotation}
      chevronPosition={local.chevronPosition}
      chevronSize={local.chevronSize}
      order={local.order}
      chevron={local.chevron}
      variant={local.variant}
      radius={local.radius}
    >
      <StylesApiProvider
        classNames={local.classNames}
        styles={local.styles}
        unstyled={local.unstyled}
      >
        <Box {...others} data-accordion>
          {local.children}
        </Box>
      </StylesApiProvider>
    </AccordionProvider>
  );
}

Accordion.Item = AccordionItem;
Accordion.Control = AccordionControl;
Accordion.Panel = AccordionPanel;
Accordion.displayName = "@mantine/core/Accordion";
