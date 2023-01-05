import { createRoot } from "solid-js";
import { useHovered } from "./use-hovered";

describe("@mantine/utils/use-hovered", () => {
  it("works correctly", () => {
    createRoot((d) => {
      const [hovered, { setHovered, resetHovered }] = useHovered();
      expect(hovered()).toBe(-1);
      setHovered(5);
      expect(hovered()).toBe(5);
      resetHovered();
      expect(hovered()).toBe(-1);

      d();
    });
  });
});
