import { JSXElement } from "solid-js";
import { patchConsoleError, render } from "testing";
import { createSafeContext } from "./create-safe-context";

interface ContextType {
  value: number;
  onChange(value: number): void;
}

describe("@mantine/utils/create-safe-context", () => {
  it("throws error if useSafeContext hook was called without Provider", () => {
    patchConsoleError();
    const [, useContext] = createSafeContext<ContextType>("test-error");
    expect(useContext).toThrow(new Error("test-error"));
    patchConsoleError.release();
  });

  it("returns context value when useSafeContext hook was called within Provider", () => {
    const fn = vi.fn();
    const [Provider, useContext] = createSafeContext<ContextType>("test-error");
    const Wrapper = (p: { children: JSXElement }) => (
      <Provider value={{ value: 100, onChange: fn }}>{p.children}</Provider>
    );
    const ContextUser = () => {
      expect(useContext()).toStrictEqual({ value: 100, onChange: fn });
      return null;
    };
    render(() => (
      <Wrapper>
        <ContextUser />
      </Wrapper>
    ));
  });
});
