import { ParentProps, splitProps } from "solid-js";
import { DefaultProps, ComponentWithRef } from "styles";
import { extractSystemStyles } from "./style-system-props/extract-system-styles/extract-system-styles";
import { Dynamic } from "solid-js/web";
import { createPolymorphicComponent, defineInspectable } from "utils";
import { useSx } from "./use-sx/use-sx";

export interface BoxProps extends ParentProps, DefaultProps {}

export const _Box: ComponentWithRef<
  BoxProps & { component: any },
  HTMLDivElement
> = (props) => {
  const [local, others] = splitProps(props, [
    "className",
    "component",
    "style",
    "sx",
  ]);
  const { systemStyles, rest } = extractSystemStyles(others);
  return (
    <Dynamic
      component={local.component || "div"}
      class={useSx(local.sx, systemStyles, local.className)}
      style={local.style}
      {...rest}
    />
  );
};

_Box.displayName = "@mantine/core/Box";

export const Box = createPolymorphicComponent<"div", BoxProps>(
  defineInspectable(_Box)
);
