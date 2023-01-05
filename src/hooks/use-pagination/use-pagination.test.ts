import { createRoot } from "solid-js";
import { usePagination } from "./use-pagination";

describe("@mantine/hooks/use-pagination", () => {
  it("setPage function sets active page", () => {
    createRoot((d) => {
      const { setPage, active } = usePagination({ total: 10 });

      setPage(5);
      expect(active()).toBe(5);

      setPage(15);
      expect(active()).toBe(10);

      setPage(-1);
      expect(active()).toBe(1);

      d();
    });
  });

  it("returns correct initial state", () => {
    createRoot((d) => {
      const { range, active } = usePagination({ total: 10 });
      expect(range()).toStrictEqual([1, 2, 3, 4, 5, "dots", 10]);
      expect(active()).toBe(1);

      d();
    });
  });

  it("does not change range length between page changes", () => {
    createRoot((d) => {
      const { range, next } = usePagination({ total: 10 });

      [...new Array(10).fill(null)].forEach(() => {
        expect(range().length).toBe(7);
        next();
      });

      d();
    });
  });

  it("returns correct initial state with custom parameters", () => {
    createRoot((d) => {
      const { range, active } = usePagination({
        total: 20,
        siblings: 2,
        boundaries: 2,
        initialPage: 7,
      });
      expect(range()).toStrictEqual([
        1,
        2,
        "dots",
        5,
        6,
        7,
        8,
        9,
        "dots",
        19,
        20,
      ]);
      expect(active()).toBe(7);

      d();
    });
  });

  it("calls onChange correctly with active page", () => {
    createRoot((d) => {
      const spy = vi.fn();
      const { next } = usePagination({
        page: 7,
        onChange: spy,
        total: 20,
        siblings: 2,
        boundaries: 2,
      });
      next();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(8);

      d();
    });
  });

  it("does not change range length between page changes with custom parameters", () => {
    createRoot((d) => {
      const { range, next } = usePagination({
        total: 20,
        siblings: 2,
        boundaries: 2,
        initialPage: 7,
      });
      [...new Array(20).fill(null)].forEach(() => {
        expect(range().length).toBe(11);

        next();
      });

      d();
    });
  });
});
