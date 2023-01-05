import { useMenuContext } from "../Menu.context";
import { Popover } from "../../Popover";
import { splitProps, JSXElement } from "solid-js";
import { Component } from "styles";

export interface MenuTargetProps {
  /** Target element */
  children: JSXElement;

  /** Key of the prop that should be used to get element ref */
  refProp?: string;
}

export const MenuTarget: Component<MenuTargetProps> = (props) => {
  const [local, others] = splitProps(props, ["children"]);

  const ctx = useMenuContext();

  const onClick = () => ctx.trigger === "click" && ctx.toggleDropdown();
  const onMouseEnter = () => ctx.trigger === "hover" && ctx.openDropdown();
  const onMouseLeave = () => ctx.trigger === "hover" && ctx.closeDropdown();

  return (
    <Popover.Target
      popupType="menu"
      __childrenProps={{
        onClick,
        onMouseEnter,
        onMouseLeave,
        "data-expanded": ctx.opened() ? true : undefined,
      }}
      {...others}
    >
      {local.children}
    </Popover.Target>
  );
};

MenuTarget.displayName = "@mantine/core/MenuTarget";
