import type { MantineColor } from "styles";
import { ComponentProps } from "solid-js";

export interface LoaderProps extends Omit<ComponentProps<"svg">, "ref"> {
  size: number;
  color: MantineColor;
}
