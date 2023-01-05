import { getTransitionStyles } from "./get-transition-styles";
import { transitions } from "../transitions";

const customTransition = {
  in: { opacity: 1, backgroundColor: "red" },
  out: { opacity: 0, backgroundColor: "blue" },
  common: { color: "green" },
  transitionProperty: "color, background-color",
};

describe("@mantine/core/Transition/get-transition-styles", () => {
  it("returns predefined transition with string value", () => {
    expect(
      getTransitionStyles({
        transition: "slide-up",
        state: "entered",
        duration: 625,
        timingFunction: "ease",
      })
    ).toStrictEqual({
      ...transitions["slide-up"].in,
      ...transitions["slide-up"].common,
      "transition-property": transitions["slide-up"].transitionProperty,
      "transition-duration": "625ms",
      "transition-timing-function": "ease",
    });

    expect(
      getTransitionStyles({
        transition: "slide-up",
        state: "exited",
        duration: 625,
        timingFunction: "ease",
      })
    ).toStrictEqual({
      ...transitions["slide-up"].out,
      ...transitions["slide-up"].common,
      "transition-property": transitions["slide-up"].transitionProperty,
      "transition-duration": "625ms",
      "transition-timing-function": "ease",
    });
  });

  it("accepts custom transitions", () => {
    expect(
      getTransitionStyles({
        transition: customTransition,
        state: "entered",
        duration: 625,
        timingFunction: "ease",
      })
    ).toStrictEqual({
      ...customTransition.in,
      ...customTransition.common,
      "transition-property": customTransition.transitionProperty,
      "transition-duration": "625ms",
      "transition-timing-function": "ease",
    });

    expect(
      getTransitionStyles({
        transition: customTransition,
        state: "exited",
        duration: 625,
        timingFunction: "ease",
      })
    ).toStrictEqual({
      ...customTransition.out,
      ...customTransition.common,
      "transition-property": customTransition.transitionProperty,
      "transition-duration": "625ms",
      "transition-timing-function": "ease",
    });
  });
});
