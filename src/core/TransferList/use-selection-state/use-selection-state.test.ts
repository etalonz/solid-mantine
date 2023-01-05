import { createRoot } from "solid-js";
import { useSelectionState } from "./use-selection-state";

describe("@mantine/core/TransferList/use-selection-state", () => {
  it("sets correct selection for string value", () => {
    createRoot((d) => {
      const [selection, { select }] = useSelectionState();

      select(0, "test-1");
      expect(selection()).toStrictEqual([["test-1"], []]);

      select(0, "test-2");
      expect(selection()).toStrictEqual([["test-1", "test-2"], []]);

      select(1, "test-3");
      expect(selection()).toStrictEqual([["test-1", "test-2"], ["test-3"]]);

      select(0, "test-1");
      expect(selection()).toStrictEqual([["test-2"], ["test-3"]]);

      d();
    });
  });

  it("deselects correct values", () => {
    createRoot((d) => {
      const [selection, { deselect }] = useSelectionState([
        ["test-1", "test-2", "test-3"],
        ["test-4"],
      ]);

      deselect(0, ["test-1", "test-2"]);
      expect(selection()).toStrictEqual([["test-3"], ["test-4"]]);

      deselect(0, ["test-3", "test-2"]);
      expect(selection()).toStrictEqual([[], ["test-4"]]);

      deselect(0, ["test-4"]);
      expect(selection()).toStrictEqual([[], ["test-4"]]);

      deselect(1, ["test-4"]);
      expect(selection()).toStrictEqual([[], []]);

      d();
    });
  });

  it("deselects all values", () => {
    createRoot((d) => {
      const [selection, { deselectAll }] = useSelectionState([
        ["test-1", "test-2", "test-3"],
        ["test-4"],
      ]);

      deselectAll(0);
      expect(selection()).toStrictEqual([[], ["test-4"]]);

      deselectAll(1);
      expect(selection()).toStrictEqual([[], []]);

      d();
    });
  });
});
