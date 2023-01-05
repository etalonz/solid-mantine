import { itSupportsSystemProps } from "testing";
import { Table, TableProps } from "./Table";

const defaultProps: TableProps = {};

describe("@mantine/core/Table", () => {
  itSupportsSystemProps({
    component: Table,
    props: defaultProps,
    displayName: "@mantine/core/Table",
    refType: HTMLTableElement,
    providerName: "Table",
  });
});
