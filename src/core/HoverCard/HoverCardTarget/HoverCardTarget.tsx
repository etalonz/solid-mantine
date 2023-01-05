import { splitProps } from "solid-js";
import { Component } from "styles";
import { Popover, PopoverTargetProps } from "../../Popover";
import { useHoverCardContext } from "../HoverCard.context";

export interface HoverCardTargetProps extends PopoverTargetProps {}

export const HoverCardTarget: Component<HoverCardTargetProps> = (props) => {
  const [local, others] = splitProps(props, ["children"]);
  const ctx = useHoverCardContext();

  return (
    <Popover.Target
      {...others}
      __childrenProps={{
        onMouseEnter: ctx.openDropdown,
        onMouseLeave: ctx.closeDropdown,
      }}
    >
      {local.children}
    </Popover.Target>
  );
};

HoverCardTarget.displayName = "@mantine/core/HoverCardTarget";
