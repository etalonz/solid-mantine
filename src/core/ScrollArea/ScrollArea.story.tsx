import { createSignal } from "solid-js";
import { ScrollArea } from "./ScrollArea";

export default { title: "ScrollArea" };

const content = Array(10)
  .fill(0)
  .map(() => () => (
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam qui minima,
      voluptates aperiam labore delectus consequuntur tempore a sed ullam? Vitae
      ducimus amet distinctio, fugiat odio accusamus veniam sit hic.
    </p>
  ));

export function OnScrollChange() {
  const [scrollPosition, onScrollPositionChange] = createSignal({ x: 0, y: 0 });
  return (
    <div style={{ padding: "40px", "max-width": "300px" }}>
      <ScrollArea
        style={{ height: "200px" }}
        onScrollPositionChange={onScrollPositionChange}
      >
        <div style={{ width: "600px" }}>{content}</div>
      </ScrollArea>
      <div>
        scroll position x: {scrollPosition().x}, y: {scrollPosition().y}
      </div>
    </div>
  );
}

export function NeverType() {
  return (
    <ScrollArea style={{ height: "200px" }} type="never">
      <div style={{ width: "600px" }}>{content}</div>
    </ScrollArea>
  );
}
