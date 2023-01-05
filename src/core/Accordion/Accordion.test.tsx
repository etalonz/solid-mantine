import userEvent from "@testing-library/user-event";
import {
  checkAccessibility,
  cleanup,
  itSupportsSystemProps,
  render,
  screen,
  setupMatchMediaMock,
} from "testing";
import { Accordion } from "./Accordion";
import { AccordionItem } from "./AccordionItem/AccordionItem";
import { AccordionControl } from "./AccordionControl/AccordionControl";
import { AccordionPanel } from "./AccordionPanel/AccordionPanel";

const defaultProps = {
  transitionDuration: 0,
  children: () => (
    <>
      <Accordion.Item value="item-1">
        <Accordion.Control>Label 1</Accordion.Control>
        <Accordion.Panel>test-item-1</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Control>Label 2</Accordion.Control>
        <Accordion.Panel>test-item-2</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Control>Label 3</Accordion.Control>
        <Accordion.Panel>test-item-3</Accordion.Panel>
      </Accordion.Item>
    </>
  ),
};

describe("@mantine/core/Accordion", () => {
  setupMatchMediaMock();

  checkAccessibility([
    () => <Accordion {...defaultProps} />,
    () => <Accordion {...defaultProps} order={2} />,
  ]);

  itSupportsSystemProps({
    component: Accordion,
    props: defaultProps,
    displayName: "@mantine/core/Accordion",
    providerName: "Accordion",
  });

  it("renders correct amount of items", () => {
    const { container } = render(() => <Accordion {...defaultProps} />);
    expect(container.querySelectorAll(".mantine-Accordion-item")).toHaveLength(
      3
    );
    cleanup();
  });

  it("support uncontrolled state (multiple: false, default)", async () => {
    render(() => <Accordion {...defaultProps} defaultValue="item-2" />);
    expect(screen.getByText("test-item-2")).toBeInTheDocument();
    expect(screen.queryAllByText("test-item-1")).toHaveLength(0);

    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.queryAllByText("test-item-2")).toHaveLength(0);
    expect(screen.getByText("test-item-1")).toBeInTheDocument();
    cleanup();
  });

  it("support uncontrolled state (multiple: true)", async () => {
    render(() => (
      <Accordion {...defaultProps} multiple defaultValue={["item-2"]} />
    ));
    expect(screen.queryAllByText("test-item-1").length).toBe(0);
    expect(screen.getByText("test-item-2")).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("test-item-1")).toBeInTheDocument();
    expect(screen.getByText("test-item-2")).toBeInTheDocument();
    cleanup();
  });

  it("supports navigating between items with up and down arrows (loop: true, default)", async () => {
    render(() => <Accordion {...defaultProps} defaultValue="item-1" />);

    await userEvent.type(screen.getAllByRole("button")[0], "{arrowdown}");
    expect(screen.getAllByRole("button")[1]).toHaveFocus();

    await userEvent.type(screen.getAllByRole("button")[2], "{arrowup}");
    expect(screen.getAllByRole("button")[1]).toHaveFocus();

    await userEvent.type(screen.getAllByRole("button")[2], "{arrowdown}");
    expect(screen.getAllByRole("button")[0]).toHaveFocus();

    await userEvent.type(screen.getAllByRole("button")[0], "{arrowup}");
    expect(screen.getAllByRole("button")[2]).toHaveFocus();
    cleanup();
  });

  it("supports navigating between items with up and down arrows (loop: false)", async () => {
    render(() => (
      <Accordion {...defaultProps} defaultValue="item-1" loop={false} />
    ));

    await userEvent.type(screen.getAllByRole("button")[0], "{arrowdown}");
    expect(screen.getAllByRole("button")[1]).toHaveFocus();

    await userEvent.type(screen.getAllByRole("button")[2], "{arrowup}");
    expect(screen.getAllByRole("button")[1]).toHaveFocus();

    await userEvent.type(screen.getAllByRole("button")[2], "{arrowdown}");
    expect(screen.getAllByRole("button")[2]).toHaveFocus();

    await userEvent.type(screen.getAllByRole("button")[0], "{arrowup}");
    expect(screen.getAllByRole("button")[0]).toHaveFocus();
    cleanup();
  });

  it("supports controlled state (multiple: false, default)", async () => {
    const spy = vi.fn();
    render(() => <Accordion {...defaultProps} value="item-2" onChange={spy} />);

    expect(screen.getByText("test-item-2")).toBeInTheDocument();
    expect(screen.queryAllByText("test-item-1")).toHaveLength(0);

    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(spy).toHaveBeenCalledWith("item-1");

    expect(screen.getByText("test-item-2")).toBeInTheDocument();
    expect(screen.queryAllByText("test-item-1")).toHaveLength(0);
    cleanup();
  });

  it("supports controlled state (multiple: true)", async () => {
    const spy = vi.fn();
    render(() => (
      <Accordion {...defaultProps} value={["item-2"]} multiple onChange={spy} />
    ));

    expect(screen.getByText("test-item-2")).toBeInTheDocument();
    expect(screen.queryAllByText("test-item-1")).toHaveLength(0);

    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(spy).toHaveBeenCalledWith(["item-2", "item-1"]);

    expect(screen.getByText("test-item-2")).toBeInTheDocument();
    expect(screen.queryAllByText("test-item-1")).toHaveLength(0);
    cleanup();
  });

  it("opens items initially based on defaultValue prop (multiple: false, default)", () => {
    render(() => <Accordion {...defaultProps} defaultValue="item-3" />);
    expect(screen.getByText("test-item-3")).toBeInTheDocument();
    expect(screen.queryAllByText("test-item-2")).toHaveLength(0);
    expect(screen.queryAllByText("test-item-1")).toHaveLength(0);
    cleanup();
  });

  it("opens items initially based on defaultValue prop (multiple: true)", () => {
    render(() => (
      <Accordion
        {...defaultProps}
        multiple
        defaultValue={["item-3", "item-1"]}
      />
    ));
    expect(screen.getByText("test-item-3")).toBeInTheDocument();
    expect(screen.getByText("test-item-1")).toBeInTheDocument();
    expect(screen.queryAllByText("test-item-2")).toHaveLength(0);
    cleanup();
  });

  it("handles tab key correctly", async () => {
    render(() => <Accordion {...defaultProps} />);
    expect(document.body).toHaveFocus();

    await userEvent.tab();
    expect(screen.getAllByRole("button")[0]).toHaveFocus();

    await userEvent.tab();
    expect(screen.getAllByRole("button")[1]).toHaveFocus();

    await userEvent.tab();
    expect(screen.getAllByRole("button")[2]).toHaveFocus();

    await userEvent.tab();
    expect(document.body).toHaveFocus();
    cleanup();
  });

  it("exposes internal components as static properties", () => {
    expect(Accordion.Item).toBe(AccordionItem);
    expect(Accordion.Control).toBe(AccordionControl);
    expect(Accordion.Panel).toBe(AccordionPanel);
  });
});
