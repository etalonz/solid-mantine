import { itRendersChildren, itSupportsSystemProps } from "testing";
import { SimpleGrid, SimpleGridProps } from "./SimpleGrid";

const defaultProps: SimpleGridProps = {
  cols: 2,
  children: () => <span>test</span>,
};

describe("@mantine/core/SimpleGrid", () => {
  itRendersChildren(SimpleGrid, defaultProps);
  itSupportsSystemProps({
    component: SimpleGrid,
    props: defaultProps,
    displayName: "@mantine/core/SimpleGrid",
    refType: HTMLDivElement,
    providerName: "SimpleGrid",
  });
});
