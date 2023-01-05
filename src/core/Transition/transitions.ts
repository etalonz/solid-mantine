import { JSX } from "solid-js";

export interface MantineTransitionStyles {
  common?: JSX.CSSProperties;
  in: JSX.CSSProperties;
  out: JSX.CSSProperties;
  transitionProperty: JSX.CSSProperties["transition-property"];
}

export type MantineTransitionName =
  | "fade"
  | "skew-up"
  | "skew-down"
  | "rotate-right"
  | "rotate-left"
  | "slide-down"
  | "slide-up"
  | "slide-right"
  | "slide-left"
  | "scale-y"
  | "scale-x"
  | "scale"
  | "pop"
  | "pop-top-left"
  | "pop-top-right"
  | "pop-bottom-left"
  | "pop-bottom-right";

export type MantineTransition = MantineTransitionName | MantineTransitionStyles;

const popIn = {
  in: { opacity: 1, transform: "scale(1)" },
  out: { opacity: 0, transform: "scale(.9) translateY(10px)" },
  transitionProperty: "transform, opacity",
};

export const transitions: Record<
  MantineTransitionName,
  MantineTransitionStyles
> = {
  fade: {
    in: { opacity: 1 },
    out: { opacity: 0 },
    transitionProperty: "opacity",
  },

  scale: {
    in: { opacity: 1, transform: "scale(1)" },
    out: { opacity: 0, transform: "scale(0)" },
    common: { "transform-origin": "top" },
    transitionProperty: "transform, opacity",
  },

  "scale-y": {
    in: { opacity: 1, transform: "scaleY(1)" },
    out: { opacity: 0, transform: "scaleY(0)" },
    common: { "transform-origin": "top" },
    transitionProperty: "transform, opacity",
  },

  "scale-x": {
    in: { opacity: 1, transform: "scaleX(1)" },
    out: { opacity: 0, transform: "scaleX(0)" },
    common: { "transform-origin": "left" },
    transitionProperty: "transform, opacity",
  },

  "skew-up": {
    in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
    out: { opacity: 0, transform: "translateY(-20px) skew(-10deg, -5deg)" },
    common: { "transform-origin": "top" },
    transitionProperty: "transform, opacity",
  },

  "skew-down": {
    in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
    out: { opacity: 0, transform: "translateY(20px) skew(-10deg, -5deg)" },
    common: { "transform-origin": "bottom" },
    transitionProperty: "transform, opacity",
  },

  "rotate-left": {
    in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    out: { opacity: 0, transform: "translateY(20px) rotate(-5deg)" },
    common: { "transform-origin": "bottom" },
    transitionProperty: "transform, opacity",
  },

  "rotate-right": {
    in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    out: { opacity: 0, transform: "translateY(20px) rotate(5deg)" },
    common: { "transform-origin": "top" },
    transitionProperty: "transform, opacity",
  },

  "slide-down": {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: "translateY(-100%)" },
    common: { "transform-origin": "top" },
    transitionProperty: "transform, opacity",
  },

  "slide-up": {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: "translateY(100%)" },
    common: { "transform-origin": "bottom" },
    transitionProperty: "transform, opacity",
  },

  "slide-left": {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: "translateX(100%)" },
    common: { "transform-origin": "left" },
    transitionProperty: "transform, opacity",
  },

  "slide-right": {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: "translateX(-100%)" },
    common: { "transform-origin": "right" },
    transitionProperty: "transform, opacity",
  },

  pop: {
    ...popIn,
    common: { "transform-origin": "center center" },
  },

  "pop-bottom-left": {
    ...popIn,
    common: { "transform-origin": "bottom left" },
  },

  "pop-bottom-right": {
    ...popIn,
    common: { "transform-origin": "bottom right" },
  },

  "pop-top-left": {
    ...popIn,
    common: { "transform-origin": "top left" },
  },

  "pop-top-right": {
    ...popIn,
    common: { "transform-origin": "top right" },
  },
};
