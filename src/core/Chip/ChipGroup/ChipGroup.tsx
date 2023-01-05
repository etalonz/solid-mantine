import { useUncontrolled } from "hooks";
import { JSXElement, splitProps } from "solid-js";
import { MantineNumberSize, useComponentDefaultProps } from "styles";
import { Group, GroupProps } from "../../Group";
import { ChipGroupProvider } from "../ChipGroup.context";

export interface ChipGroupProps<T extends boolean = false>
  extends Omit<
    GroupProps,
    "value" | "defaultValue" | "onChange" | "classNames" | "styles"
  > {
  /** Key of theme.spacing or number to set gap in px */
  spacing?: MantineNumberSize;

  /** Allow multiple values to be selected at a time */
  multiple?: T;

  /** Controlled component value */
  value?: T extends true ? string[] : string;

  /** Uncontrolled component initial value */
  defaultValue?: T extends true ? string[] : string;

  /** Called when value changes */
  onChange?(value: T extends true ? string[] : string): void;

  /** <Chip /> components */
  children?: JSXElement;
}

const defaultProps: Partial<ChipGroupProps<false>> = {
  spacing: "xs",
};

export function ChipGroup<T extends boolean>(props: ChipGroupProps<T>) {
  const [local, others] = splitProps(
    useComponentDefaultProps("ChipGroup", defaultProps as any, props),
    ["value", "defaultValue", "onChange", "spacing", "multiple", "unstyled"]
  );

  const [_value, setValue] = useUncontrolled<string | string[]>({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: local.multiple ? [] : null,
    onChange: local.onChange,
  });

  const isChipSelected = (val: string) =>
    Array.isArray(_value()) ? _value().includes(val) : val === _value();

  const handleChange = (event: any) => {
    const val = event.currentTarget.value;
    if (Array.isArray(_value())) {
      setValue(
        _value().includes(val)
          ? (_value() as Array<string>).filter((v) => v !== val)
          : [..._value(), val]
      );
    } else {
      setValue(val);
    }
  };

  return (
    <ChipGroupProvider
      value={{
        isChipSelected,
        onChange: handleChange,
        multiple: local.multiple,
      }}
    >
      <Group spacing={local.spacing} unstyled={local.unstyled} {...others} />
    </ChipGroupProvider>
  );
}

ChipGroup.displayName = "@mantine/core/ChipGroup";
