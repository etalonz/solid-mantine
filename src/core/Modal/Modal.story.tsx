import { Modal } from "./Modal";
import { Button } from "../Button";
import { ColorInput } from "../ColorInput";
import { ComponentProps, createSignal } from "solid-js";

export default { title: "Modal" };

function WrappedModal(
  props: Omit<ComponentProps<typeof Modal>, "opened" | "onClose">
) {
  const [opened, setOpened] = createSignal(false);

  return (
    <div style={{ padding: "50px" }}>
      <Button onClick={() => setOpened(true)}>Open Modal</Button>
      <Modal opened={opened()} onClose={() => setOpened(false)} {...props} />
    </div>
  );
}

const content = Array(40)
  .fill(0)
  .map(() => () => (
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
      nesciunt architecto beatae iure, aliquam laborum molestias ratione
      delectus sed cupiditate, nobis impedit eos vero neque magni minima
      repellendus! Beatae, illo.
    </p>
  ));

export function FullScreenWithOverflow() {
  return (
    <div style={{ padding: "40px" }}>
      <WrappedModal fullScreen>{content}</WrappedModal>
      {content}
    </div>
  );
}

export function SizeAuto() {
  return (
    <div style={{ padding: "40px" }}>
      <WrappedModal size="auto">{content}</WrappedModal>
    </div>
  );
}

export function WithPageScrollbars() {
  return (
    <div style={{ padding: "40px" }}>
      <WrappedModal>Wrapped modal</WrappedModal>
      {content}
    </div>
  );
}

export function WithPortalChildren() {
  return (
    <div style={{ padding: "40px" }}>
      <WrappedModal>
        <ColorInput label="No Portal" mb="md" />
        <ColorInput label="Within Portal" mb="md" withinPortal />
      </WrappedModal>
    </div>
  );
}
