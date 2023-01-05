import {
  itRendersChildren,
  itIsPolymorphic,
  itSupportsSystemProps,
} from "testing";
import { CardSection, CardSectionProps } from "./CardSection";

const defaultProps: CardSectionProps = {};

describe("@mantine/core/CardSection", () => {
  itRendersChildren(CardSection, defaultProps);
  itIsPolymorphic(CardSection, defaultProps);
  itSupportsSystemProps({
    component: CardSection,
    props: defaultProps,
    displayName: "@mantine/core/CardSection",
    refType: HTMLDivElement,
  });
});
