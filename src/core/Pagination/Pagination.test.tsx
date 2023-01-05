import { checkAccessibility, itSupportsSystemProps } from "testing";
import { Pagination, PaginationProps } from "./Pagination";

const defaultProps: PaginationProps = {
  total: 10,
  getItemAriaLabel: () => "test-label",
};

describe("@mantine/core/Pagination", () => {
  checkAccessibility([() => <Pagination {...defaultProps} />]);
  itSupportsSystemProps({
    component: Pagination,
    props: defaultProps,
    displayName: "@mantine/core/Pagination",
    refType: HTMLDivElement,
    providerName: "Pagination",
  });
});
