import { ComponentProps } from "solid-js";
import { getDefaultZIndex, useComponentDefaultProps } from "styles";
import { ForwardRefWithStaticComponents } from "utils";
import {
  HorizontalSection,
  HorizontalSectionSharedProps,
} from "../HorizontalSection/HorizontalSection";
import { Section } from "../HorizontalSection/Section/Section";

export interface AsideProps
  extends HorizontalSectionSharedProps,
    Omit<ComponentProps<"nav">, "children"> {}

type AsideComponent = ForwardRefWithStaticComponents<
  AsideProps,
  { Section: typeof Section }
>;

const defaultProps: Partial<AsideProps> = {
  fixed: false,
  position: { top: 0, right: 0 },
  zIndex: getDefaultZIndex("app"),
  hiddenBreakpoint: "md",
  hidden: false,
};

export const Aside: AsideComponent = (props: AsideProps) => {
  const _props = useComponentDefaultProps("Aside", defaultProps, props);
  return (
    <HorizontalSection section="aside" __staticSelector="Aside" {..._props} />
  );
};

Aside.Section = Section;
Aside.displayName = "@mantine/core/Aside";
