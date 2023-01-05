import { createRoot } from "solid-js";
import { useDisclosure } from "./use-disclosure";

describe("@mantine/hooks/use-disclosure", () => {
  it("handles close correctly", () => {
    createRoot((dispose) => {
      const [opened, { close }] = useDisclosure(true);
      expect(opened()).toBe(true);
      close();
      expect(opened()).toBe(false);
      dispose();
    });
  });

  it("handles open correctly", () => {
    createRoot((dispose) => {
      const [opened, { open }] = useDisclosure(false);
      expect(opened()).toBe(false);
      open();
      expect(opened()).toBe(true);
      dispose();
    });
  });

  it("handles toggle correctly", () => {
    createRoot((dispose) => {
      const [opened, { toggle }] = useDisclosure(false);
      expect(opened()).toBe(false);

      toggle();
      expect(opened()).toBe(true);

      toggle();
      expect(opened()).toBe(false);

      dispose();
    });
  });

  it("calls onClose when close is called", () => {
    createRoot((dispose) => {
      const spy = vi.fn();
      const [, { close }] = useDisclosure(true, { onClose: spy });
      expect(spy).toHaveBeenCalledTimes(0);

      close();
      expect(spy).toHaveBeenCalledTimes(1);

      close();
      expect(spy).toHaveBeenCalledTimes(1);

      dispose();
    });
  });

  it("calls onOpen when open is called", () => {
    createRoot((dispose) => {
      const spy = vi.fn();
      const [, { open }] = useDisclosure(false, { onOpen: spy });
      expect(spy).toHaveBeenCalledTimes(0);

      open();
      expect(spy).toHaveBeenCalledTimes(1);

      open();
      expect(spy).toHaveBeenCalledTimes(1);

      dispose();
    });
  });

  it("calls onOpen and onClose correctly when toggle is called", () => {
    createRoot((dispose) => {
      const onClose = vi.fn();
      const onOpen = vi.fn();

      const [, { toggle }] = useDisclosure(false, { onOpen, onClose });
      expect(onOpen).toHaveBeenCalledTimes(0);
      expect(onClose).toHaveBeenCalledTimes(0);

      toggle();
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(0);

      toggle();
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);

      toggle();
      expect(onOpen).toHaveBeenCalledTimes(2);
      expect(onClose).toHaveBeenCalledTimes(1);

      dispose();
    });
  });
});
