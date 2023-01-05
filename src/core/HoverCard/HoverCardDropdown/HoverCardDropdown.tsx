import { JSXElement, splitProps } from "solid-js";
import { createEventHandler } from "utils";
import { Popover, PopoverDropdownProps } from "../../Popover";
import { useHoverCardContext } from "../HoverCard.context";

export interface HoverCardDropdownProps extends PopoverDropdownProps {
  /** Dropdown content */
  children?: JSXElement;
}

export function HoverCardDropdown(props: HoverCardDropdownProps) {
  const [local, others] = splitProps(props, ["onMouseEnter", "onMouseLeave"]);

  const ctx = useHoverCardContext();

  const handleMouseEnter = createEventHandler(
    local.onMouseEnter as any,
    ctx.openDropdown
  );
  const handleMouseLeave = createEventHandler(
    local.onMouseLeave as any,
    ctx.closeDropdown
  );

  return (
    <Popover.Dropdown
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...others}
    />
  );
}

HoverCardDropdown.displayName = "@mantine/core/HoverCardDropdown";
