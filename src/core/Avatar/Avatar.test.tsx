import {
  checkAccessibility,
  itIsPolymorphic,
  itSupportsSystemProps,
  render,
  screen,
} from "testing";
import { Avatar, AvatarProps } from "./Avatar";

const defaultProps: AvatarProps = {
  src: "./test-image",
};

describe("@mantine/core/Avatar", () => {
  itIsPolymorphic(Avatar, defaultProps);
  checkAccessibility([
    () => <Avatar {...defaultProps} alt="It's me!" />,
    () => <Avatar src={null} alt="It's me!" />,
  ]);

  itSupportsSystemProps({
    component: Avatar,
    props: defaultProps,
    displayName: "@mantine/core/Avatar",
    refType: HTMLDivElement,
    providerName: "Avatar",
  });

  it("passes src and alt to image", () => {
    render(() => <Avatar {...defaultProps} alt="test-alt" />);
    expect(screen.getByAltText("test-alt")).toBeInTheDocument();
    expect(screen.getByAltText("test-alt")).toHaveAttribute(
      "src",
      "./test-image"
    );
  });

  it("renders placeholder if src was not provided", () => {
    const { container } = render(() => (
      <Avatar src={null} alt="no-image-test" />
    ));
    expect(
      container.querySelector(".mantine-Avatar-placeholder")
    ).toBeInTheDocument();
  });

  it("renders children if src was not given", () => {
    render(() => (
      <Avatar src={null} alt="no-image-test">
        <span class="test-placeholder">test-placeholder</span>
      </Avatar>
    ));

    expect(screen.getByText("test-placeholder")).toBeInTheDocument();
  });
});
