import { JSXElement, createMemo } from "solid-js";
import { createComponent } from "solid-js/web";
import {
  MantineNumberSize,
  CSSObject,
  useComponentDefaultProps,
  MantineTheme,
} from "styles";
import { inspectChildren, isComponentObject } from "utils";
import useStyles from "./MediaQuery.styles";

export interface MediaQueryProps {
  className?: string;

  /** Child that should be shown at given breakpoint, it must accept className prop */
  children: JSXElement;

  /** Styles applied to child when viewport is smaller than given breakpoint */
  smallerThan?: MantineNumberSize;

  /** Styles applied to child when viewport is larger than given breakpoint */
  largerThan?: MantineNumberSize;

  /** Any other media query */
  query?: string;

  /** Styles applied to child when breakpoint matches */
  styles: CSSObject | ((theme: MantineTheme) => CSSObject);
}

export function MediaQuery(props_: MediaQueryProps) {
  const props = useComponentDefaultProps("MediaQuery", {}, props_);

  const { classes, cx } = useStyles(
    {
      smallerThan: props.smallerThan,
      largerThan: props.largerThan,
      query: props.query,
      styles: props.styles,
    },
    { name: "MediaQuery" }
  );

  const Children = inspectChildren(() => props.children);

  const child = createMemo(() => {
    const first = Children()[0];
    if (isComponentObject(first)) {
      return createComponent(first.Component, {
        className: cx(classes.media, first.props.className, props.className),
      });
    }
    return first;
  });

  return child();
}

MediaQuery.displayName = "@mantine/core/MediaQuery";
