import { Component, DefaultProps } from "styles";
import { createPolymorphicComponent, defineInspectable } from "utils";
import { useCardPadding } from "../Card.context";
import { Box } from "../../Box";
import useStyles from "./CardSection.styles";
import { splitProps } from "solid-js";

export interface CardSectionProps extends DefaultProps {
  /** Determines whether section should have border */
  withBorder?: boolean;

  /** Determines whether section from inherit padding from Card */
  inheritPadding?: boolean;
}

export const _CardSection: Component<CardSectionProps> = (props) => {
  const [local, others] = splitProps(props, [
    "className",
    "withBorder",
    "inheritPadding",
    "unstyled",
  ]);

  const { classes, cx } = useStyles(
    {
      padding: useCardPadding(),
      withBorder: local.withBorder,
      inheritPadding: local.inheritPadding,
    },
    { name: "Card", unstyled: local.unstyled }
  );
  return (
    <Box className={cx(classes.cardSection, local.className)} {...others} />
  );
};

_CardSection.displayName = "@mantine/core/CardSection";

export const CardSection = createPolymorphicComponent<"div", CardSectionProps>(
  defineInspectable(_CardSection)
);
