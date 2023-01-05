import { AspectRatio } from "./AspectRatio";

export default {
  title: "AspectRatio",
};

export function Usage() {
  return (
    <AspectRatio ratio={16 / 9}>
      <div style={{ "background-color": "silver" }}>AspectRatio</div>
    </AspectRatio>
  );
}
