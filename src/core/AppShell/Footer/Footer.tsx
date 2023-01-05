import { ComponentProps, FlowProps } from "solid-js";
import { getDefaultZIndex, useComponentDefaultProps } from "styles";
import {
  VerticalSection,
  VerticalSectionSharedProps,
} from "../VerticalSection/VerticalSection";

export interface FooterProps
  extends VerticalSectionSharedProps,
    FlowProps<ComponentProps<"nav">> {}

const defaultProps: Partial<FooterProps> = {
  fixed: false,
  position: { bottom: 0, left: 0, right: 0 },
  zIndex: getDefaultZIndex("app"),
};

export const Footer = (props: FooterProps) => {
  const _props = useComponentDefaultProps("Footer", defaultProps, props);
  return (
    <VerticalSection section="footer" __staticSelector="Footer" {..._props} />
  );
};

Footer.displayName = "@mantine/core/Footer";
