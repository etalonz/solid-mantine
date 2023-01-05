import { JSX } from "solid-js";
import { MantineColor } from "./MantineColor";
import type { MantineNumberSize, MantineSize } from "./MantineSize";

export type SystemProp<Value> =
  | Value
  | Partial<Record<MantineSize | (string & {}), Value>>;

export type SpacingValue = MantineNumberSize | (string & {});

export interface MantineStyleSystemProps {
  m?: SystemProp<SpacingValue>;
  my?: SystemProp<SpacingValue>;
  mx?: SystemProp<SpacingValue>;
  mt?: SystemProp<SpacingValue>;
  mb?: SystemProp<SpacingValue>;
  ml?: SystemProp<SpacingValue>;
  mr?: SystemProp<SpacingValue>;

  p?: SystemProp<SpacingValue>;
  py?: SystemProp<SpacingValue>;
  px?: SystemProp<SpacingValue>;
  pt?: SystemProp<SpacingValue>;
  pb?: SystemProp<SpacingValue>;
  pl?: SystemProp<SpacingValue>;
  pr?: SystemProp<SpacingValue>;

  bg?: SystemProp<MantineColor>;
  c?: SystemProp<MantineColor>;
  opacity?: SystemProp<JSX.CSSProperties["opacity"]>;

  ff?: SystemProp<JSX.CSSProperties["font-family"]>;
  fz?: SystemProp<SpacingValue>;
  fw?: SystemProp<JSX.CSSProperties["font-weight"]>;
  lts?: SystemProp<JSX.CSSProperties["letter-spacing"]>;
  ta?: SystemProp<JSX.CSSProperties["text-align"]>;
  lh?: SystemProp<JSX.CSSProperties["line-height"]>;
  fs?: SystemProp<JSX.CSSProperties["font-style"]>;
  tt?: SystemProp<JSX.CSSProperties["text-transform"]>;
  td?: SystemProp<JSX.CSSProperties["text-decoration"]>;

  w?: SystemProp<JSX.CSSProperties["width"]>;
  miw?: SystemProp<JSX.CSSProperties["min-width"]>;
  maw?: SystemProp<JSX.CSSProperties["max-width"]>;
  h?: SystemProp<JSX.CSSProperties["height"]>;
  mih?: SystemProp<JSX.CSSProperties["min-height"]>;
  mah?: SystemProp<JSX.CSSProperties["max-height"]>;

  bgsz?: SystemProp<JSX.CSSProperties["background-size"]>;
  bgp?: SystemProp<JSX.CSSProperties["background-position"]>;
  bgr?: SystemProp<JSX.CSSProperties["background-repeat"]>;
  bga?: SystemProp<JSX.CSSProperties["background-attachment"]>;

  pos?: SystemProp<JSX.CSSProperties["position"]>;
  top?: SystemProp<JSX.CSSProperties["top"]>;
  left?: SystemProp<JSX.CSSProperties["left"]>;
  bottom?: SystemProp<JSX.CSSProperties["bottom"]>;
  right?: SystemProp<JSX.CSSProperties["right"]>;
  inset?: SystemProp<JSX.CSSProperties["inset"]>;
}

export type MantineStyleSystemSize = keyof MantineStyleSystemProps;
