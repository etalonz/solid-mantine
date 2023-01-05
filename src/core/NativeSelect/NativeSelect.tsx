import { ComponentProps, createMemo, For, splitProps } from "solid-js";
import { Component, DefaultProps, MantineSize, useMantineTheme } from "styles";
import {
  InputWrapperBaseProps,
  InputWrapperStylesNames,
  Input,
  InputSharedProps,
  InputStylesNames,
  useInputProps,
} from "../Input";
import { getSelectRightSectionProps } from "../Select/SelectRightSection/get-select-right-section-props";
import { SelectItem } from "../Select/types";

export type NativeSelectStylesNames =
  | InputStylesNames
  | InputWrapperStylesNames;

export interface NativeSelectProps
  extends DefaultProps<NativeSelectStylesNames>,
    InputWrapperBaseProps,
    InputSharedProps,
    Omit<ComponentProps<"select">, "size"> {
  /** id is used to bind input and label, if not passed unique id will be generated for each input */
  id?: string;

  /** Data used to render options */
  data: (string | SelectItem)[];

  /** Props passed to root element (InputWrapper component) */
  wrapperProps?: Record<string, any>;

  /** Input size */
  size?: MantineSize;
}

const defaultProps: Partial<NativeSelectProps> = {
  size: "sm",
};

export const NativeSelect: Component<NativeSelectProps> = (props) => {
  const [local, others] = splitProps(
    useInputProps("NativeSelect", defaultProps, props),
    [
      "inputProps",
      "wrapperProps",
      "data",
      "onChange",
      "value",
      "classNames",
      "styles",
      "rightSection",
      "rightSectionWidth",
    ]
  );

  const theme = useMantineTheme();

  const formattedData = createMemo<
    { label: string; value: string; disabled?: boolean }[]
  >(() =>
    local.data.map((item: string | SelectItem) =>
      typeof item === "string" ? { label: item, value: item } : item
    )
  );

  return (
    <Input.Wrapper {...local.wrapperProps} __staticSelector="NativeSelect">
      <Input<"select">
        {...local.inputProps}
        {...others}
        onChange={local.onChange}
        component="select"
        value={local.value === null ? "" : local.value}
        __staticSelector="NativeSelect"
        pointer={theme.cursorType === "pointer"}
        {...getSelectRightSectionProps({
          theme,
          rightSection: local.rightSection,
          rightSectionWidth: local.rightSectionWidth,
          styles: local.styles,
          shouldClear: false,
          size: local.inputProps.size,
          error: local.wrapperProps.error,
          readOnly: false,
        })}
      >
        <For each={formattedData()}>
          {(item) => (
            <option value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          )}
        </For>
      </Input>
    </Input.Wrapper>
  );
};

NativeSelect.displayName = "@mantine/core/NativeSelect";
