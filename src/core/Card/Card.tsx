import {
  ComponentWithRef,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import {
  createPolymorphicComponent,
  inspectChildren,
  isComponentObject,
} from "utils";
import { Paper, PaperProps } from "../Paper/Paper";
import { CardSection } from "./CardSection/CardSection";
import useStyles from "./Card.styles";
import { CardProvider } from "./Card.context";
import { FlowProps, splitProps, mapArray, JSXElement } from "solid-js";
import { createComponent } from "solid-js/web";

export interface CardProps extends FlowProps<Omit<PaperProps, "p">> {
  p?: MantineNumberSize;
}

const defaultProps: Partial<CardProps> = {
  p: "md",
};

export const _Card: ComponentWithRef<CardProps, HTMLDivElement> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Card", defaultProps, props),
    ["className", "p", "radius", "children", "unstyled"]
  );

  const { classes, cx } = useStyles(null, {
    name: "Card",
    unstyled: local.unstyled,
  });

  const Children = inspectChildren(() => local.children);

  const content = mapArray(Children, (child, index) => {
    if (isComponentObject(child, CardSection)) {
      return createComponent(child.Component, {
        padding: local.p,
        "data-first": index() === 0 || undefined,
        "data-last": index() === Children().length - 1 || undefined,
      });
    }
    return child as JSXElement;
  });

  return (
    <CardProvider value={{ padding: local.p }}>
      <Paper
        className={cx(classes.root, local.className)}
        radius={local.radius}
        p={local.p}
        {...others}
      >
        {content()}
      </Paper>
    </CardProvider>
  );
};

(_Card as any).Section = CardSection;
_Card.displayName = "@mantine/core/Card";

export const Card = createPolymorphicComponent<
  "div",
  CardProps,
  { Section: typeof CardSection }
>(_Card);
