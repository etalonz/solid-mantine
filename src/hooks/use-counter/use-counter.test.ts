import { createRoot } from "solid-js";
import { useCounter } from "./use-counter";

describe("@mantine/hooks/use-counter", () => {
  it("correctly returns initial state", () => {
    createRoot((d) => {
      const [value] = useCounter(20, { min: 0, max: 100 });
      expect(value()).toBe(20);
      d();
    });
  });

  it("correctly performs operations without initialValue or options", () => {
    createRoot((d) => {
      const [value, { increment, decrement, set, reset }] = useCounter();
      expect(value()).toBe(0);

      increment();
      expect(value()).toBe(1);

      decrement();
      expect(value()).toBe(0);

      set(5);
      expect(value()).toBe(5);

      reset();
      expect(value()).toBe(0);

      d();
    });
  });

  it("correctly performs operations with initialValue and options", () => {
    createRoot((d) => {
      const [value, { increment, decrement, set, reset }] = useCounter(11, {
        min: -10,
        max: 10,
      });

      expect(value()).toBe(10);

      increment();
      expect(value()).toBe(10);

      decrement();
      expect(value()).toBe(9);

      set(5);
      expect(value()).toBe(5);

      set(20);
      expect(value()).toBe(10);

      reset();
      expect(value()).toBe(10);
    });
  });
});
