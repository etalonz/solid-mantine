import { itSupportsSystemProps, render } from "testing";
import { Timeline } from "./Timeline";
import { TimelineItem } from "./TimelineItem/TimelineItem";

const defaultProps = {
  items: [
    { title: "Hello", bullet: "$", children: () => 2 },
    { children: () => 2 },
    { children: () => 3 },
  ],
};

describe("@mantine/core/Timeline", () => {
  itSupportsSystemProps({
    component: Timeline,
    props: defaultProps,
    excludePadding: true,
    displayName: "@mantine/core/Timeline",
    refType: HTMLDivElement,
    providerName: "Timeline",
  });

  it("handles active item correctly", () => {
    const { container: secondActive } = render(() => (
      <Timeline {...defaultProps} active={1} />
    ));
    const { container: thirdActive } = render(() => (
      <Timeline {...defaultProps} active={2} />
    ));

    expect(
      secondActive.querySelectorAll(".mantine-Timeline-item[data-active]")
    ).toHaveLength(2);
    expect(
      secondActive.querySelectorAll(".mantine-Timeline-item[data-line-active]")
    ).toHaveLength(1);

    expect(
      thirdActive.querySelectorAll(".mantine-Timeline-item[data-active]")
    ).toHaveLength(3);
    expect(
      thirdActive.querySelectorAll(".mantine-Timeline-item[data-line-active]")
    ).toHaveLength(2);
  });

  it("exposes TimelineItem as Timeline.Item", () => {
    expect(Timeline.Item).toBe(TimelineItem);
  });
});
