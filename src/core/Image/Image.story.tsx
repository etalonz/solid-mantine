import { useInterval } from "hooks";
import { MantineProvider } from "styles";
import { Container } from "../Container";
import { Image } from "./Image";
import { AspectRatio } from "../AspectRatio";
import { createSignal } from "solid-js";

const images = [
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3748&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3506&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3870&q=80",
];

function ImageChangesOverTime() {
  const [current, setCurrent] = createSignal(0);
  const interval = useInterval(
    () => setCurrent((c) => (c === 2 ? 0 : c + 1)),
    2000
  );
  interval.start();
  return <Image src={images[current()]} withPlaceholder />;
}

export default { title: "Image" };

export const CaptionWithFixedHeight = () => (
  <>
    <Image
      src="https://images.unsplash.com/photo-1490855680410-49b201432be4?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTk3MDQyMDI&ixlib=rb-1.2.1&q=85&dl=unsplash-bantersnaps.jpg"
      height={"200px"}
      caption="This is caption"
    />
    <Image mt="xl" height={"200px"} caption="This is caption" />
    <Image mt="xl" height={"200px"} caption="This is caption" withPlaceholder />
  </>
);
export const SrcChangesOverTime = () => <ImageChangesOverTime />;
export const PlaceholderWithCustomSizeAndContainerLargerThanImage = () => (
  <Container size={60}>
    <Image
      radius="sm"
      src={null}
      withPlaceholder
      width={"50px"}
      height={"50px"}
    />
  </Container>
);
export const PlaceholderWithCustomSizeAndContainerSmallerThanImage = () => (
  <Container size={40}>
    <Image
      radius="sm"
      src={null}
      withPlaceholder
      width={"50px"}
      height={"50px"}
    />
  </Container>
);
export const ResponsiveImageWithAspectRatio = () => (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <div
      style={{ width: "400px", padding: "20px", "background-color": "#fdf" }}
    >
      <p>Responsive Image with AspectRatio</p>
      <AspectRatio ratio={2}>
        <Image src="https://picsum.photos/600/600" withPlaceholder />
      </AspectRatio>
      <p>Responsive Placeholder with AspectRatio</p>
      <AspectRatio ratio={2}>
        <Image withPlaceholder />
      </AspectRatio>
    </div>
  </MantineProvider>
);
