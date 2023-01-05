import { ComponentProps, splitProps } from "solid-js";
import { Component, useComponentDefaultProps, useMantineTheme } from "styles";
import { createPolymorphicComponent } from "utils";
import { ActionIcon, ActionIconProps } from "../ActionIcon/ActionIcon";
import { CloseIcon } from "./CloseIcon";

export interface CloseButtonProps
  extends Omit<ActionIconProps, "children">,
    Omit<ComponentProps<"button">, "color"> {
  /** Width and height of cross icon */
  iconSize?: number;
}

const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const defaultProps: Partial<CloseButtonProps> = {
  size: "md",
};

export const _CloseButton: Component<CloseButtonProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("CloseButton", defaultProps, props),
    ["iconSize", "size"]
  );

  const theme = useMantineTheme();
  const _iconSize =
    local.iconSize ||
    theme.fn.size({ size: local.size || "md", sizes: iconSizes });

  return (
    <ActionIcon size={local.size || "md"} {...others}>
      <CloseIcon width={_iconSize} height={_iconSize} />
    </ActionIcon>
  );
};

_CloseButton.displayName = "@mantine/core/CloseButton";

export const CloseButton = createPolymorphicComponent<
  "button",
  CloseButtonProps
>(_CloseButton);
