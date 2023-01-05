import {
  itRendersChildren,
  itIsPolymorphic,
  itSupportsSystemProps,
} from "testing";
import { Section, SectionProps } from "./Section";

const defaultProps: SectionProps = {
  children: "test-section",
};

describe("@mantine/core/Section", () => {
  itRendersChildren(Section, defaultProps);
  itIsPolymorphic(Section, defaultProps);
  itSupportsSystemProps({
    component: Section,
    props: defaultProps,
    displayName: "@mantine/core/Section",
    refType: HTMLDivElement,
  });
});
