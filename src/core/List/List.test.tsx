import { itSupportsSystemProps, render } from "testing";
import { ListItem } from "./ListItem/ListItem";
import { List, ListProps } from "./List";

const defaultProps: ListProps = {
  children: [
    () => <List.Item>1</List.Item>,
    () => <List.Item>2</List.Item>,
    () => <List.Item>3</List.Item>,
  ],
};

describe("@mantine/core/List", () => {
  itSupportsSystemProps({
    component: List,
    props: defaultProps,
    displayName: "@mantine/core/List",
    refType: HTMLUListElement,
  });

  it("changes root element based on type prop", () => {
    const { container: ordered } = render(() => (
      <List {...defaultProps} type="ordered" />
    ));
    const { container: unordered } = render(() => (
      <List {...defaultProps} type="unordered" />
    ));

    expect(ordered.querySelector("ol")).toBeInTheDocument();
    expect(unordered.querySelector("ul")).toBeInTheDocument();
  });

  it("exposes ListItem as List.Item", () => {
    expect(List.Item).toBe(ListItem);
  });
});
