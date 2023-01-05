import { createSignal } from "solid-js";
import { useMove } from "./use-move";

const Demo = () => {
  const [value, onChange] = createSignal({ x: 0, y: 0 });
  const { ref, active } = useMove(onChange);

  return (
    <div>
      <div style={{ color: active ? "red" : "blue", "margin-bottom": "10px" }}>
        x: {Math.round(value().x * 100)}% – y: {Math.round(value().y * 100)}%
      </div>
      <div
        ref={ref}
        style={{
          position: "relative",
          height: "200px",
          width: "200px",
          "background-color": "gray",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `calc(${value().x * 100}% - 8px)`,
            top: `calc(${value().y * 100}% - 8px)`,
            width: "16px",
            height: "16px",
            "background-color": "blue",
          }}
        />
      </div>
    </div>
  );
};

const HorizontalDemo = () => {
  const [value, setValue] = createSignal(0.2);
  const { ref, active } = useMove(({ x }) => setValue(x));

  return (
    <>
      <div style={{ color: active ? "red" : "blue", "margin-bottom": "10px" }}>
        x: {Math.round(value() * 100)}%
      </div>
      <div
        ref={ref}
        style={{
          width: "400px",
          height: "16px",
          "background-color": "gray",
          position: "relative",
        }}
      >
        {/* Filled bar */}
        <div
          style={{
            width: `${value() * 100}%`,
            height: "16px",
          }}
        />

        {/* Thumb */}
        <div
          style={{
            position: "absolute",
            left: `calc(${value() * 100}% - 8px)`,
            top: 0,
            width: "16px",
            height: "16px",
            "background-color": "blue",
          }}
        />
      </div>
    </>
  );
};

export default { title: "Hooks/use-move" };

export const GeneralUsage = () => (
  <div style={{ padding: "40px" }}>
    <Demo />
  </div>
);

export const HorizontalUsage = () => (
  <div style={{ padding: "40px" }}>
    <HorizontalDemo />
  </div>
);
