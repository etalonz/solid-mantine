import { itRendersChildren, itSupportsSystemProps } from "testing";
import { Header, HeaderProps } from "./Header";

const defaultProps: HeaderProps = {
  height: 60,
  children: "test-header",
};

describe("@mantine/core/Header", () => {
  itRendersChildren(Header, defaultProps);
  itSupportsSystemProps({
    component: Header,
    props: defaultProps,
    displayName: "@mantine/core/Header",
    refType: HTMLElement,
    providerName: "Header",
  });
});
