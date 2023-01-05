import { MantineProvider } from "styles";
import { render, cleanup } from "./solid";
import { Component } from "solid-js";

export function itSupportsProviderDefaultProps<P>(
  Component: Component<P>,
  requiredProps: P,
  name: string,
  selector?: string
) {
  it("supports default props on MantineProvider", () => {
    const { container } = render(() => (
      <MantineProvider
        theme={{
          components: {
            [name]: {
              defaultProps: { "data-provider-prop": "test-provider-prop" },
            },
          },
        }}
      >
        <Component {...requiredProps} />
      </MantineProvider>
    ));

    const target = selector
      ? container.querySelector(selector)
      : container.firstChild;
    expect(target).toHaveAttribute("data-provider-prop", "test-provider-prop");
    cleanup();
  });
}
