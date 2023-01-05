import { itRendersChildren, itSupportsSystemProps } from "testing";
import { Aside, AsideProps } from "./Aside";
import { Section } from "../HorizontalSection/Section/Section";

const defaultProps: AsideProps = { children: "test-aside" };

describe("@mantine/core/Aside", () => {
  itRendersChildren(Aside, defaultProps);
  itSupportsSystemProps({
    component: Aside,
    props: defaultProps,
    displayName: "@mantine/core/Aside",
    refType: HTMLElement,
    providerName: "Aside",
  });

  it("exposes Section as Aside.Section", () => {
    expect(Aside.Section).toBe(Section);
  });
});
