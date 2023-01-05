import { axe, toHaveNoViolations } from "jest-axe";
import { Component } from "solid-js";
import { render, cleanup } from "./solid";

const config = {
  rules: {
    region: {
      enabled: false,
    },

    "autocomplete-valid": {
      enabled: false,
    },
  },
};

export function checkAccessibility(elements: Component[]) {
  expect.extend(toHaveNoViolations);

  it("has no accessibility violations", async () => {
    // workaround for not implemented errors
    const { getComputedStyle } = window;
    window.getComputedStyle = (elt) => getComputedStyle(elt);
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const Element of elements) {
      const { container } = render(() => <Element />);
      const result = await axe(container, config);
      expect(result).toHaveNoViolations();
      cleanup();
    }
    window.getComputedStyle = getComputedStyle;
    cleanup();
  }, 30000);
}
