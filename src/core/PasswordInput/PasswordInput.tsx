import { useId, useUncontrolled } from "hooks";
import {
  Selectors,
  DefaultProps,
  useMantineTheme,
  useComponentDefaultProps,
  Component,
} from "styles";
import { extractSystemStyles } from "../Box";
import { ActionIcon } from "../ActionIcon";
import { TextInputProps, TextInputStylesNames } from "../TextInput";
import { Input } from "../Input";
import { PasswordToggleIcon } from "./PasswordToggleIcon";
import useStyles from "./PasswordInput.styles";
import { Component as SolidComponent, splitProps } from "solid-js";

export type PasswordInputStylesNames =
  | Selectors<typeof useStyles>
  | TextInputStylesNames;

export interface PasswordInputProps
  extends DefaultProps<PasswordInputStylesNames>,
    Omit<TextInputProps, "classNames" | "styles"> {
  /** Toggle button tabIndex, set to 0 to make button focusable with tab key */
  toggleTabIndex?: -1 | 0;

  /** Provide your own visibility toggle icon */
  visibilityToggleIcon?: SolidComponent<{ reveal: boolean; size: number }>;

  /** aria-label for visibility toggle button */
  visibilityToggleLabel?: string;

  /** Determines whether input content should be visible (controlled) */
  visible?: boolean;

  /** Determines whether input content should be visible (uncontrolled) */
  defaultVisible?: boolean;

  /** Called when visibility changes */
  onVisibilityChange?(visible: boolean): void;
}

const buttonSizes = {
  xs: 22,
  sm: 26,
  md: 28,
  lg: 32,
  xl: 40,
};

const iconSizes = {
  xs: 12,
  sm: 15,
  md: 17,
  lg: 19,
  xl: 21,
};

const rightSectionSizes = {
  xs: 28,
  sm: 32,
  md: 34,
  lg: 44,
  xl: 54,
};

const defaultProps: Partial<PasswordInputProps> = {
  size: "sm",
  toggleTabIndex: -1,
  visibilityToggleIcon: PasswordToggleIcon,
  __staticSelector: "PasswordInput",
};

export const PasswordInput: Component<PasswordInputProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("PasswordInput", defaultProps, props),
    [
      "ref",
      "radius",
      "disabled",
      "size",
      "toggleTabIndex",
      "className",
      "id",
      "label",
      "error",
      "required",
      "style",
      "icon",
      "description",
      "wrapperProps",
      "classNames",
      "styles",
      "variant",
      "visibilityToggleIcon",
      "__staticSelector",
      "rightSection",
      "rightSectionWidth",
      "rightSectionProps",
      "sx",
      "labelProps",
      "descriptionProps",
      "errorProps",
      "unstyled",
      "visibilityToggleLabel",
      "withAsterisk",
      "inputWrapperOrder",
      "visible",
      "defaultVisible",
      "onVisibilityChange",
    ]
  );

  const theme = useMantineTheme();
  const rightSectionWidth = theme.fn.size({
    size: local.size,
    sizes: rightSectionSizes,
  });
  const { classes, cx } = useStyles(
    { size: local.size, rightSectionWidth },
    {
      name: "PasswordInput",
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );
  const uuid = useId(local.id);
  const { systemStyles, rest } = extractSystemStyles(others);
  const [_visible, setVisibility] = useUncontrolled({
    value: () => local.visible,
    defaultValue: local.defaultVisible,
    finalValue: false,
    onChange: local.onVisibilityChange,
  });

  const toggleVisibility = () => setVisibility(!_visible());

  const rightSection = () => (
    <ActionIcon<"button">
      className={classes.visibilityToggle}
      tabIndex={local.toggleTabIndex}
      radius={local.radius}
      size={theme.fn.size({ size: local.size, sizes: buttonSizes })}
      aria-hidden={!local.visibilityToggleLabel}
      aria-label={local.visibilityToggleLabel}
      unstyled={local.unstyled}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleVisibility();
      }}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          toggleVisibility();
        }
      }}
    >
      <local.visibilityToggleIcon
        reveal={_visible()}
        size={theme.fn.size({ size: local.size, sizes: iconSizes })}
      />
    </ActionIcon>
  );

  return (
    <Input.Wrapper
      required={local.required}
      id={uuid}
      label={local.label}
      error={local.error}
      description={local.description}
      size={local.size}
      className={local.className}
      style={local.style}
      classNames={local.classNames}
      styles={local.styles}
      __staticSelector={local.__staticSelector}
      sx={local.sx}
      errorProps={local.errorProps}
      descriptionProps={local.descriptionProps}
      labelProps={local.labelProps}
      unstyled={local.unstyled}
      withAsterisk={local.withAsterisk}
      inputWrapperOrder={local.inputWrapperOrder}
      {...systemStyles}
      {...local.wrapperProps}
    >
      <Input<"div">
        component="div"
        invalid={!!local.error}
        icon={local.icon}
        size={local.size}
        classNames={{ ...local.classNames, input: classes.input }}
        styles={local.styles}
        radius={local.radius}
        disabled={local.disabled}
        __staticSelector={local.__staticSelector}
        rightSectionWidth={rightSectionWidth}
        rightSection={!local.disabled && rightSection}
        variant={local.variant}
        unstyled={local.unstyled}
      >
        <input
          type={_visible() ? "text" : "password"}
          required={local.required}
          class={cx(classes.innerInput, {
            [classes.withIcon]: local.icon,
            [classes.invalid]: !!local.error,
          })}
          disabled={local.disabled}
          id={uuid}
          ref={local.ref}
          {...rest}
        />
      </Input>
    </Input.Wrapper>
  );
};

PasswordInput.displayName = "@mantine/core/PasswordInput";
