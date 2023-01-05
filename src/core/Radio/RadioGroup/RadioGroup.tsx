import { useUncontrolled } from "hooks";
import {
  DefaultProps,
  MantineNumberSize,
  MantineSize,
  useComponentDefaultProps,
} from "styles";
import {
  Input,
  InputWrapperBaseProps,
  InputWrapperStylesNames,
} from "../../Input";
import { InputsGroup } from "../../Checkbox/CheckboxGroup/InputsGroup";
import { RadioGroupProvider } from "../RadioGroup.context";
import { ComponentProps, JSXElement, splitProps } from "solid-js";

export type RadioGroupStylesNames = InputWrapperStylesNames;

export interface RadioGroupProps
  extends DefaultProps<RadioGroupStylesNames>,
    InputWrapperBaseProps,
    Omit<ComponentProps<"div">, "onChange"> {
  /** <Radio /> components */
  children: JSXElement;

  /** Value of currently selected radio */
  value?: string;

  /** Initial value for uncontrolled component */
  defaultValue?: string;

  /** Called when value changes */
  onChange?(value: string): void;

  /** Horizontal or vertical orientation */
  orientation?: "horizontal" | "vertical";

  /** Spacing between radios in horizontal orientation */
  spacing?: MantineNumberSize;

  /** Space between label and inputs */
  offset?: MantineNumberSize;

  /** Predefined label fontSize, radio width, height and border-radius */
  size?: MantineSize;

  /** Props spread to root element */
  wrapperProps?: Record<string, any>;

  /** Name attribute of radio inputs */
  name?: string;
}

const defaultProps: Partial<RadioGroupProps> = {
  orientation: "horizontal",
  spacing: "lg",
  offset: "xs",
  size: "sm",
};

export const RadioGroup = (props: RadioGroupProps) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("RadioGroup", defaultProps, props),
    [
      "children",
      "value",
      "defaultValue",
      "onChange",
      "orientation",
      "spacing",
      "size",
      "wrapperProps",
      "unstyled",
      "offset",
      "name",
    ]
  );

  const [_value, setValue] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: "",
    onChange: local.onChange,
  });

  const handleChange = (event: any) => setValue(event.currentTarget.value);

  return (
    <RadioGroupProvider
      value={{
        value: _value,
        onChange: handleChange,
        size: local.size,
        name: local.name,
      }}
    >
      <Input.Wrapper
        labelElement="div"
        size={local.size}
        __staticSelector="RadioGroup"
        unstyled={local.unstyled}
        {...local.wrapperProps}
        {...others}
      >
        <InputsGroup
          spacing={local.spacing}
          orientation={local.orientation}
          unstyled={local.unstyled}
          role="radiogroup"
          offset={local.offset}
        >
          {local.children}
        </InputsGroup>
      </Input.Wrapper>
    </RadioGroupProvider>
  );
};

RadioGroup.displayName = "@mantine/core/RadioGroup";
