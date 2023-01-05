import { getSafeId } from "utils";
import { useUncontrolled, useId } from "hooks";
import { MantineNumberSize } from "styles";
import { AccordionContextProvider } from "./Accordion.context";
import {
  AccordionValue,
  AccordionChevronPosition,
  AccordionHeadingOrder,
  AccordionVariant,
} from "./Accordion.types";
import { ACCORDION_ERRORS } from "./Accordion.errors";
import { JSXElement } from "solid-js";

export interface AccordionProviderProps<Multiple extends boolean = false> {
  /** Base id, used to generate ids that connect labels with controls, by default generated randomly */
  id?: string;

  /** Determines whether arrow key presses should loop though items (first to last and last to first) */
  loop?: boolean;

  /** Accordion content */
  children: JSXElement;

  /** Determines whether multiple items can be opened at a time */
  multiple?: Multiple;

  /** Value for controlled component */
  value?: AccordionValue<Multiple>;

  /** Default value for uncontrolled component */
  defaultValue?: AccordionValue<Multiple>;

  /** Callback for controlled component */
  onChange?(value: AccordionValue<Multiple>): void;

  /** Transition duration in ms, set 0 to disable transitions */
  transitionDuration?: number;

  /** Determines whether chevron rotation should be disabled */
  disableChevronRotation?: boolean;

  /** Determines position of the chevron */
  chevronPosition?: AccordionChevronPosition;

  /** Chevron size in px */
  chevronSize?: number;

  /** Heading order, has no effect on visuals */
  order?: AccordionHeadingOrder;

  /** Replaces chevron on all items */
  chevron?: JSXElement;

  /** Controls visuals */
  variant?: AccordionVariant;

  /** border-radius from theme.radius or number to set value in px, will not be applied to default variant  */
  radius?: MantineNumberSize;
}

export function AccordionProvider<Multiple extends boolean = false>(
  p: AccordionProviderProps<Multiple>
) {
  const uid = useId(p.id);
  const [_value, handleChange] = useUncontrolled({
    value: () => p.value,
    defaultValue: p.defaultValue,
    finalValue: p.multiple ? ([] as any) : null,
    onChange: p.onChange,
  });

  const isItemActive = (itemValue: string) =>
    Array.isArray(_value())
      ? _value().includes(itemValue)
      : itemValue === _value();

  const handleItemChange = (itemValue: string) => {
    const nextValue: AccordionValue<Multiple> = Array.isArray(_value())
      ? _value().includes(itemValue)
        ? _value().filter((selectedValue) => selectedValue !== itemValue)
        : [..._value(), itemValue]
      : itemValue === _value()
      ? null
      : (itemValue as any);

    handleChange(nextValue);
  };

  return (
    <AccordionContextProvider
      value={{
        isItemActive,
        onChange: handleItemChange,
        getControlId: getSafeId(`${uid}-control`, ACCORDION_ERRORS.value),
        getRegionId: getSafeId(`${uid}-panel`, ACCORDION_ERRORS.value),
        transitionDuration: p.transitionDuration,
        disableChevronRotation: p.disableChevronRotation,
        chevronPosition: p.chevronPosition,
        chevronSize: p.chevronSize,
        order: p.order,
        chevron: p.chevron,
        loop: p.loop,
        variant: p.variant,
        radius: p.radius,
      }}
    >
      {p.children}
    </AccordionContextProvider>
  );
}
