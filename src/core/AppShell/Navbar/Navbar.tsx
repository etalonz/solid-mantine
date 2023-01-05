import { getDefaultZIndex, useComponentDefaultProps } from "styles";
import { ForwardRefWithStaticComponents } from "utils";
import {
  HorizontalSection,
  HorizontalSectionSharedProps,
} from "../HorizontalSection/HorizontalSection";
import { Section } from "../HorizontalSection/Section/Section";
import { ComponentProps, FlowProps } from "solid-js";

export interface NavbarProps
  extends HorizontalSectionSharedProps,
    FlowProps<ComponentProps<"nav">> {}

type NavbarComponent = ForwardRefWithStaticComponents<
  NavbarProps,
  { Section: typeof Section }
>;

const defaultProps: Partial<NavbarProps> = {
  fixed: false,
  position: { top: 0, left: 0 },
  zIndex: getDefaultZIndex("app"),
  hiddenBreakpoint: "md",
  hidden: false,
};

export const Navbar: NavbarComponent = (props: NavbarProps) => {
  const _props = useComponentDefaultProps("Navbar", defaultProps, props);
  return (
    <HorizontalSection section="navbar" __staticSelector="Navbar" {..._props} />
  );
};

Navbar.Section = Section;
Navbar.displayName = "@mantine/core/Navbar";
