import { ComponentProps, JSXElement, splitProps } from "solid-js";
import { MantineNumberSize, DefaultProps, Selectors, Component } from "styles";
import { Box } from "../../Box";
import useStyles from "./SliderRoot.styles";

export type SliderRootStylesNames = Selectors<typeof useStyles>;

export interface SliderRootProps
  extends DefaultProps<SliderRootStylesNames>,
    ComponentProps<"div"> {
  size: MantineNumberSize;
  children: JSXElement;
  disabled: boolean;
}

export const SliderRoot: Component<SliderRootProps> = (
  props: SliderRootProps
) => {
  const [local, others] = splitProps(props, [
    "className",
    "size",
    "classNames",
    "styles",
    "disabled",
    "unstyled",
  ]);

  const { classes, cx } = useStyles(
    { size: local.size, disabled: local.disabled },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Slider",
    }
  );
  return (
    <Box
      {...others}
      tabIndex={-1}
      className={cx(classes.root, local.className)}
    />
  );
};

SliderRoot.displayName = "@mantine/core/SliderRoot";
