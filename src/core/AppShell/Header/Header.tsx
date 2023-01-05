import { FlowProps, ComponentProps } from "solid-js";
import { getDefaultZIndex, useComponentDefaultProps } from "styles";
import {
  VerticalSection,
  VerticalSectionSharedProps,
} from "../VerticalSection/VerticalSection";

export interface HeaderProps
  extends VerticalSectionSharedProps,
    FlowProps<ComponentProps<"nav">> {}

const defaultProps: Partial<HeaderProps> = {
  fixed: false,
  position: { top: 0, left: 0, right: 0 },
  zIndex: getDefaultZIndex("app"),
};

export const Header = (props: HeaderProps) => {
  const _props = useComponentDefaultProps("Header", defaultProps, props);
  return (
    <VerticalSection section="header" __staticSelector="Header" {..._props} />
  );
};

Header.displayName = "@mantine/core/Header";
