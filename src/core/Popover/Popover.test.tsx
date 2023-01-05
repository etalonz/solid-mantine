import userEvent from "@testing-library/user-event";
import { Box } from "../Box";
import {
  itRendersChildren,
  checkAccessibility,
  wait,
  render,
  screen,
  cleanup,
  setupMatchMediaMock,
  setupResizeObserverMock,
} from "testing";
import { Popover, PopoverProps } from "./Popover";
import { PopoverDropdown } from "./PopoverDropdown/PopoverDropdown";
import { PopoverTarget } from "./PopoverTarget/PopoverTarget";

const defaultProps: PopoverProps = {
  opened: true,
  children: null,
};

function TestContainer(props: Partial<PopoverProps>) {
  return (
    <Popover transitionDuration={0} {...props}>
      <Popover.Target>
        <Box component="button" type="button">
          test-target
        </Box>
      </Popover.Target>

      <Popover.Dropdown>
        <div>test-dropdown</div>
        <input aria-label="1" />
        <input aria-label="2" data-autofocus />
        <input aria-label="3" />
      </Popover.Dropdown>
    </Popover>
  );
}

describe("@mantine/core/component", () => {
  setupResizeObserverMock();
  setupMatchMediaMock();

  checkAccessibility([
    () => <TestContainer opened />,
    () => <TestContainer opened={false} />,
  ]);
  itRendersChildren(Popover, defaultProps);

  it("supports uncontrolled mode", async () => {
    render(() => <TestContainer />);
    expect(screen.queryAllByText("test-dropdown")).toHaveLength(0);

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("test-dropdown")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button"));
    expect(screen.queryAllByText("test-dropdown")).toHaveLength(0);

    cleanup();
  });

  it("correctly handles defaultOpened prop", () => {
    render(() => <TestContainer defaultOpened />);
    expect(screen.getByText("test-dropdown")).toBeInTheDocument();
    cleanup();
  });

  it("calls onOpen and onClose functions when dropdown state changes", async () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(() => <TestContainer onOpen={onOpen} onClose={onClose} />);

    await userEvent.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(0);

    await userEvent.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("supports controlled mode", async () => {
    const spy = vi.fn();
    render(() => <TestContainer opened onChange={spy} />);

    await userEvent.click(screen.getByRole("button"));
    expect(spy).toHaveBeenCalledTimes(0);

    await userEvent.type(screen.getByRole("dialog"), "{Escape}");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(false);

    await userEvent.click(document.body);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(false);

    cleanup();
  });

  it("correctly handles closeOnClickOutside={false}", async () => {
    const spy = vi.fn();
    render(() => (
      <TestContainer defaultOpened closeOnClickOutside={false} onClose={spy} />
    ));
    await userEvent.click(document.body);
    expect(spy).not.toHaveBeenCalled();

    cleanup();
  });

  it("correctly handles closeOnClickOutside={true}", async () => {
    const spy = vi.fn();
    render(() => (
      <TestContainer defaultOpened closeOnClickOutside onClose={spy} />
    ));
    await userEvent.click(document.body);
    expect(spy).toHaveBeenCalled();

    cleanup();
  });

  it("correctly handles closeOnEscape={false}", async () => {
    const spy = vi.fn();
    render(() => (
      <TestContainer defaultOpened closeOnEscape={false} onClose={spy} />
    ));
    await userEvent.type(screen.getByRole("dialog"), "{Escape}");
    expect(spy).not.toHaveBeenCalled();

    cleanup();
  });

  it("correctly handles closeOnEscape={true}", async () => {
    const spy = vi.fn();
    render(() => <TestContainer defaultOpened closeOnEscape onClose={spy} />);
    await userEvent.type(screen.getByRole("dialog"), "{Escape}");
    expect(spy).toHaveBeenCalled();

    cleanup();
  });

  it("correctly handles trapFocus={true}", async () => {
    render(() => <TestContainer defaultOpened trapFocus />);
    await wait(10);
    expect(document.querySelectorAll("input")[1]).toHaveFocus();

    userEvent.tab();
    expect(document.querySelectorAll("input")[2]).toHaveFocus();

    userEvent.tab();
    expect(document.querySelectorAll("input")[0]).toHaveFocus();

    cleanup();
  });

  it("correctly handles trapFocus={false}", async () => {
    const { container } = render(() => (
      <TestContainer defaultOpened={true} trapFocus={false} />
    ));
    await wait(10);
    expect(document.body).toHaveFocus();

    userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    userEvent.tab();
    expect(container.querySelectorAll("input")[0]).toHaveFocus();

    userEvent.tab();
    expect(container.querySelectorAll("input")[1]).toHaveFocus();

    userEvent.tab();
    expect(container.querySelectorAll("input")[2]).toHaveFocus();

    userEvent.tab();
    expect(document.body).toHaveFocus();

    cleanup();
  });

  it("sets dropdown z-index based on zIndex prop", () => {
    render(() => <TestContainer defaultOpened zIndex={452} />);
    expect(screen.getByRole("dialog")).toHaveStyle({ zIndex: 452 });

    cleanup();
  });

  it("correctly handles withArrow={true}", () => {
    const { container } = render(() => (
      <TestContainer defaultOpened withArrow />
    ));
    expect(container.querySelectorAll(".mantine-Popover-arrow")).toHaveLength(
      1
    );

    cleanup();
  });

  it("correctly handles withArrow={false}", () => {
    const { container } = render(() => (
      <TestContainer defaultOpened withArrow={false} />
    ));
    expect(container.querySelectorAll(".mantine-Popover-arrow")).toHaveLength(
      0
    );

    cleanup();
  });

  it("exposes PopoverTarget and PopoverDropdown as static properties", () => {
    expect(Popover.Dropdown).toBe(PopoverDropdown);
    expect(Popover.Target).toBe(PopoverTarget);
  });
});
