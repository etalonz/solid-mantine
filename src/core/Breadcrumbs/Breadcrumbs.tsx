import {
  Component,
  DefaultProps,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { Text } from "../Text";
import { Box } from "../Box";
import useStyles from "./Breadcrumbs.styles";
import {
  ComponentProps,
  FlowProps,
  JSXElement,
  splitProps,
  createMemo,
} from "solid-js";
import { inspectChildren, isComponentObject } from "utils";
import { createComponent } from "solid-js/web";

export type BreadcrumbsStylesNames = Selectors<typeof useStyles>;

export interface BreadcrumbsProps
  extends DefaultProps<BreadcrumbsStylesNames>,
    FlowProps<ComponentProps<"div">> {
  /** Separator between breadcrumbs */
  separator?: JSXElement;
}

const defaultProps: Partial<BreadcrumbsProps> = {
  separator: "/",
};

export const Breadcrumbs: Component<BreadcrumbsProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Breadcrumbs", defaultProps, props),
    ["className", "children", "separator", "classNames", "styles", "unstyled"]
  );

  const { classes, cx } = useStyles(null, {
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    name: "Breadcrumbs",
  });

  const Children = inspectChildren(() => local.children);

  const items = createMemo(() =>
    Children().reduce<JSXElement[]>((acc, child, index, array) => {
      const item = isComponentObject(child) ? (
        createComponent(child.Component, {
          className: cx(classes.breadcrumb, child.props.className),
        })
      ) : (
        <div class={classes.breadcrumb}>{child}</div>
      );

      acc.push(item);

      if (index !== array.length - 1)
        acc.push(
          <Text size="sm" className={classes.separator}>
            {local.separator}
          </Text>
        );

      return acc;
    }, [])
  );

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      {items()}
    </Box>
  );
};

Breadcrumbs.displayName = "@mantine/core/Breadcrumbs";
