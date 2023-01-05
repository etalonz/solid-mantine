import { useId } from "./use-id";

describe("use-id", () => {
  it("returns static id", () => {
    const view = useId("test-id");
    expect(view).toBe("test-id");
  });

  it("returns random id if static id is not provided", () => {
    const view = useId();
    expect(typeof view).toBe("string");
    expect(view.includes("mantine")).toBe(true);
    expect(view !== useId()).toBe(true);
  });
});
