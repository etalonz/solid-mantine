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
import { SwitchGroupProvider } from "../SwitchGroup.context";
import { ComponentProps, JSXElement, splitProps } from "solid-js";

export type SwitchGroupStylesNames = InputWrapperStylesNames;

export interface SwitchGroupProps
  extends DefaultProps<SwitchGroupStylesNames>,
    InputWrapperBaseProps,
    Omit<ComponentProps<"div">, "onChange"> {
  /** <Checkbox /> components only */
  children: JSXElement;

  /** Value of currently selected checkbox */
  value?: string[];

  /** Initial value for uncontrolled component */
  defaultValue?: string[];

  /** Called when value changes */
  onChange?(value: string[]): void;

  /** Horizontal or vertical orientation */
  orientation?: "horizontal" | "vertical";

  /** Spacing between checkboxes in horizontal orientation */
  spacing?: MantineNumberSize;

  /** Space between label and inputs */
  offset?: MantineNumberSize;

  /** Predefined label fontSize, checkbox width, height and border-radius */
  size?: MantineSize;

  /** Props spread to InputWrapper */
  wrapperProps?: Record<string, any>;
}

const defaultProps: Partial<SwitchGroupProps> = {
  orientation: "horizontal",
  spacing: "lg",
  size: "sm",
  offset: "xs",
};

export const SwitchGroup = (props: SwitchGroupProps) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("SwitchGroup", defaultProps, props),
    [
      "children",
      "value",
      "defaultValue",
      "onChange",
      "orientation",
      "spacing",
      "size",
      "wrapperProps",
      "offset",
    ]
  );

  const [_value, setValue] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: [],
    onChange: local.onChange,
  });

  const handleChange = (event: any) => {
    const itemValue = event.currentTarget.value;
    setValue(
      _value().includes(itemValue)
        ? _value().filter((item) => item !== itemValue)
        : [..._value(), itemValue]
    );
  };

  return (
    <SwitchGroupProvider
      value={{ value: _value, onChange: handleChange, size: local.size }}
    >
      <Input.Wrapper
        labelElement="div"
        size={local.size}
        __staticSelector="SwitchGroup"
        {...local.wrapperProps}
        {...others}
      >
        <InputsGroup
          spacing={local.spacing}
          orientation={local.orientation}
          offset={local.offset}
        >
          {local.children}
        </InputsGroup>
      </Input.Wrapper>
    </SwitchGroupProvider>
  );
};

SwitchGroup.displayName = "@mantine/core/SwitchGroup";
