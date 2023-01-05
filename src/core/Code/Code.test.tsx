import { itRendersChildren, itSupportsSystemProps, render } from "testing";
import { Code, CodeProps } from "./Code";

const defaultProps: CodeProps = {
  children: "test-code",
};

describe("@mantine/core/Code", () => {
  itRendersChildren(Code, defaultProps);
  itSupportsSystemProps({
    component: Code,
    props: defaultProps,
    displayName: "@mantine/core/Code",
    refType: HTMLElement,
    providerName: "Code",
  });

  it("renders code element for inline code and pre element for block", () => {
    const { container: inline } = render(() => <Code>Code</Code>);
    const { container: block } = render(() => <Code block>Code</Code>);
    expect(inline.querySelector("code")).toBeInTheDocument();
    expect(block.querySelector("pre")).toBeInTheDocument();
  });
});
