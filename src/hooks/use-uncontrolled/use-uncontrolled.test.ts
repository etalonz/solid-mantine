import { createRoot } from "solid-js";
import { useUncontrolled } from "./use-uncontrolled";

describe("use-uncontrolled", () => {
  it("returns default value for initial uncontrolled state", () => {
    createRoot((dispose) => {
      const [value] = useUncontrolled({
        value: undefined,
        defaultValue: "test-default",
        finalValue: "test-final",
      });
      expect(value()).toBe("test-default");
      dispose();
    });
  });

  it("returns final value for initial uncontrolled state if default value was not provided", () => {
    createRoot((dispose) => {
      const [value] = useUncontrolled({
        value: undefined,
        defaultValue: undefined,
        finalValue: "test-final",
      });
      expect(value()).toBe("test-final");
      dispose();
    });
  });

  it("supports uncontrolled state", () => {
    createRoot((dispose) => {
      const [value, setValue] = useUncontrolled({
        defaultValue: "default-value",
      });
      setValue("change-value");
      expect(value()).toBe("change-value");
      dispose();
    });
  });

  it("calls onChange with uncontrolled state", () => {
    const spy = vi.fn();
    createRoot((dispose) => {
      const [_, setValue] = useUncontrolled({
        defaultValue: "default-value",
        onChange: spy,
      });
      setValue("change-value");
      expect(spy).toHaveBeenCalledWith("change-value");
      dispose();
    });
  });

  it("supports controlled state", () => {
    const spy = vi.fn();
    createRoot((dispose) => {
      const [value, setValue] = useUncontrolled({
        value: () => "controlled-value",
        onChange: spy,
      });
      setValue("change-value");
      expect(value()).toBe("controlled-value");
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("change-value");
      dispose();
    });
  });
});
