import { ComponentProps, splitProps } from "solid-js";
import {
  Component,
  DefaultProps,
  MantineNumberSize,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { UnstyledButton } from "../UnstyledButton";
import useStyles, { BurgerStylesParams } from "./Burger.styles";

export type BurgerStylesNames = Selectors<typeof useStyles>;

export interface BurgerProps
  extends DefaultProps<BurgerStylesNames, BurgerStylesParams>,
    ComponentProps<"button"> {
  /** Burger state: true for cross, false for burger */
  opened: boolean;

  /** Burger color value, not connected to theme.colors, defaults to theme.black with light color scheme and theme.white with dark */
  color?: string;

  /** Predefined burger size or number to set width and height in px */
  size?: MantineNumberSize;

  /** Transition duration in ms */
  transitionDuration?: number;
}

const defaultProps: Partial<BurgerProps> = {
  size: "md",
  transitionDuration: 300,
};

export const Burger: Component<BurgerProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Burger", defaultProps, props),
    [
      "className",
      "opened",
      "color",
      "size",
      "classNames",
      "styles",
      "transitionDuration",
    ]
  );
  const { classes, cx } = useStyles(
    {
      color: local.color,
      size: local.size,
      transitionDuration: local.transitionDuration,
    },
    { classNames: local.classNames, styles: local.styles, name: "Burger" }
  );

  return (
    <UnstyledButton className={cx(classes.root, local.className)} {...others}>
      <div data-opened={local.opened || undefined} class={classes.burger} />
    </UnstyledButton>
  );
};

Burger.displayName = "@mantine/core/Burger";
