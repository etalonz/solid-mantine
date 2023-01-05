import { MantineStyleSystemProps } from "styles";
import { splitProps } from "solid-js";

export function extractSystemStyles<T extends Record<string, any>>(
  others: MantineStyleSystemProps & T
): { systemStyles: MantineStyleSystemProps; rest: T } {
  const [systemStyles, rest] = splitProps(others, [
    "m",
    "mx",
    "my",
    "mt",
    "mb",
    "ml",
    "mr",
    "p",
    "px",
    "py",
    "pt",
    "pb",
    "pl",
    "pr",
    "bg",
    "c",
    "opacity",
    "ff",
    "fz",
    "fw",
    "lts",
    "ta",
    "lh",
    "fs",
    "tt",
    "td",
    "w",
    "miw",
    "maw",
    "h",
    "mih",
    "mah",
    "bgsz",
    "bgp",
    "bgr",
    "bga",
    "pos",
    "top",
    "left",
    "bottom",
    "right",
    "inset",
  ]);

  return { systemStyles, rest: rest as unknown as T };
}
