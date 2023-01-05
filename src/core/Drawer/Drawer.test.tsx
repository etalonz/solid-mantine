import userEvent from "@testing-library/user-event";
import {
  checkAccessibility,
  itSupportsSystemProps,
  render,
  screen,
  setupMatchMediaMock,
} from "testing";
import { Drawer, DrawerProps } from "./Drawer";

const defaultProps: DrawerProps = {
  opened: true,
  onClose: () => {},
  withinPortal: false,
};

describe("@mantine/core/Drawer", () => {
  setupMatchMediaMock();

  itSupportsSystemProps({ component: Drawer, props: defaultProps });
  checkAccessibility([
    () => (
      <Drawer
        {...defaultProps}
        aria-labelledby="drawer-title"
        aria-describedby="drawer-body"
        closeButtonLabel="Close drawer"
      >
        <h1 id="drawer-title">Title</h1>
        <div id="drawer-body">Body</div>
      </Drawer>
    ),
  ]);

  it("calls onClose when close button is clicked", async () => {
    const spy = vi.fn();
    render(() => <Drawer {...defaultProps} withinPortal onClose={spy} />);
    await userEvent.click(screen.getByRole("button"));
    expect(spy).toHaveBeenCalled();
  });

  it("renders correct title", () => {
    render(() => <Drawer {...defaultProps} title="test-title" />);
    expect(screen.getByText("test-title")).toBeInTheDocument();
  });

  it("allows to hide close button with withCloseButton={false} prop", () => {
    const { container: withCloseButton } = render(() => (
      <Drawer {...defaultProps} />
    ));
    const { container: withoutCloseButton } = render(() => (
      <Drawer {...defaultProps} withCloseButton={false} />
    ));

    expect(
      withoutCloseButton.querySelectorAll(".mantine-Drawer-closeButton")
    ).toHaveLength(0);
    expect(
      withCloseButton.querySelectorAll(".mantine-Drawer-closeButton")
    ).toHaveLength(1);
  });

  it("has correct displayName", () => {
    expect(Drawer.displayName).toStrictEqual("@mantine/core/Drawer");
  });
});
