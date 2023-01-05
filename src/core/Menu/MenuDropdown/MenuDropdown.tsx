import { ComponentProps, JSXElement, splitProps } from "solid-js";
import { DefaultProps } from "styles";
import { createEventHandler } from "utils";
import { Popover } from "../../Popover";
import { useMenuContext } from "../Menu.context";

export interface MenuDropdownProps extends DefaultProps, ComponentProps<"div"> {
  /** Item label */
  children?: JSXElement;
}

export function MenuDropdown(props: MenuDropdownProps) {
  const [local, others] = splitProps(props, [
    "children",
    "onMouseEnter",
    "onMouseLeave",
  ]);

  let wrapperRef: HTMLDivElement;
  const ctx = useMenuContext();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      wrapperRef
        .querySelectorAll<HTMLButtonElement>("[data-menu-item]")[0]
        .focus();
    }
  };

  const handleMouseEnter = createEventHandler(
    local.onMouseEnter as any,
    () => ctx.trigger === "hover" && ctx.openDropdown()
  );

  const handleMouseLeave = createEventHandler(
    local.onMouseLeave as any,
    () => ctx.trigger === "hover" && ctx.closeDropdown()
  );

  return (
    <Popover.Dropdown
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="menu"
      aria-orientation="vertical"
      {...others}
    >
      <div
        tabIndex={-1}
        data-menu-dropdown
        data-autofocus
        onKeyDown={handleKeyDown}
        ref={wrapperRef}
        style={{ outline: 0 }}
      >
        {local.children}
      </div>
    </Popover.Dropdown>
  );
}

MenuDropdown.displayName = "@mantine/core/MenuDropdown";
