import { render, screen } from "testing";
import userEvent from "@testing-library/user-event";
import { useClickOutside } from "./use-click-outside";
import { Component, Accessor } from "solid-js";

interface UseClickOutsideProps {
  handler: () => void;
  events?: string[] | null;
  nodes?: Accessor<HTMLElement>[];
}

const Target: Component<UseClickOutsideProps> = (props) => {
  const [ref, setRef] = useClickOutside(
    props.handler,
    props.events,
    props.nodes
  );
  return <div data-testid="target" ref={setRef} />;
};

describe("@mantine/hooks/use-click-outside", () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  it("calls `handler` function when clicked outside target (no `events` given)", async () => {
    const handler = vi.fn();

    render(() => (
      <>
        <Target handler={handler} />
        <div data-testid="outside-target" />
      </>
    ));

    const target = screen.getByTestId("target");
    const outsideTarget = screen.getByTestId("outside-target");

    expect(handler).toHaveBeenCalledTimes(0);

    await userEvent.click(target);
    expect(handler).toHaveBeenCalledTimes(0);

    await userEvent.click(outsideTarget);
    expect(handler).toHaveBeenCalledTimes(1);

    await userEvent.click(outsideTarget);
    expect(handler).toHaveBeenCalledTimes(2);

    await userEvent.click(target);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("calls `handler` only on given `events`", async () => {
    const handler = vi.fn();
    const events = ["keydown"];

    render(() => (
      <>
        <Target handler={handler} events={events} />
        <div data-testid="outside-target" />
      </>
    ));

    const target = screen.getByTestId("target");
    const outsideTarget = screen.getByTestId("outside-target");

    await userEvent.click(target);
    await userEvent.click(outsideTarget);
    expect(handler).toHaveBeenCalledTimes(0);

    await userEvent.type(target, "{enter}");
    await userEvent.type(outsideTarget, "{enter}");
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("ignores clicks outside the given `nodes`", async () => {
    const handler = vi.fn();

    const Wrapper: Component = () => {
      let ref;
      return (
        <>
          <Target handler={handler} nodes={[() => ref]} />
          <div data-testid="ignore-clicks" ref={ref} />
        </>
      );
    };

    render(() => (
      <div>
        <Wrapper />
      </div>
    ));

    const ignoreClicks = screen.getByTestId("ignore-clicks");

    await userEvent.click(ignoreClicks);
    expect(handler).toHaveBeenCalledTimes(0);

    const target = screen.getByTestId("target");
    await userEvent.click(target);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
