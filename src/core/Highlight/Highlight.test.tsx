import { itIsPolymorphic, itSupportsSystemProps, render } from "testing";
import { Highlight, HighlightProps } from "./Highlight";

const defaultProps: HighlightProps = { children: "Hello", highlight: "He" };

describe("@mantine/core/Highlight", () => {
  itIsPolymorphic(Highlight as any, defaultProps);
  itSupportsSystemProps({
    component: Highlight,
    props: defaultProps,
    displayName: "@mantine/core/Highlight",
    refType: HTMLDivElement,
  });

  it("highlights correct value", () => {
    const { container } = render(() => (
      <Highlight highlight="he">Hello</Highlight>
    ));
    expect(container.querySelector("mark").textContent).toBe("He");
  });
});
