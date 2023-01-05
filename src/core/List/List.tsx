import {
  DefaultProps,
  MantineNumberSize,
  Selectors,
  useComponentDefaultProps,
  StylesApiProvider,
} from "styles";
import { ForwardRefWithStaticComponents } from "utils";
import { Box } from "../Box";
import { ListItem, ListItemStylesNames } from "./ListItem/ListItem";
import { ListContext } from "./List.context";
import useStyles from "./List.styles";
import {
  ComponentProps,
  FlowProps,
  JSX,
  JSXElement,
  splitProps,
} from "solid-js";

export type ListStylesNames = ListItemStylesNames | Selectors<typeof useStyles>;

export interface ListProps
  extends DefaultProps<ListStylesNames>,
    FlowProps<ComponentProps<"ul">> {
  /** List type: ol or ul */
  type?: "ordered" | "unordered";

  /** Include padding-left to offset list from main content */
  withPadding?: boolean;

  /** Font size from theme or number to set value in px */
  size?: MantineNumberSize;

  /** Icon that should replace list item dot */
  icon?: JSXElement;

  /** Spacing between items from theme or number to set value in px */
  spacing?: MantineNumberSize;

  /** Center items with icon */
  center?: boolean;

  /** List style */
  listStyleType?: JSX.CSSProperties["list-style-type"];
}

type ListComponent = ForwardRefWithStaticComponents<
  ListProps,
  { Item: typeof ListItem }
>;

const defaultProps: Partial<ListProps> = {
  type: "unordered",
  size: "md",
  spacing: 0,
};

export const List: ListComponent = (props: ListProps) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("List", defaultProps, props),
    [
      "type",
      "size",
      "listStyleType",
      "withPadding",
      "center",
      "spacing",
      "icon",
      "className",
      "styles",
      "classNames",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    {
      withPadding: local.withPadding,
      size: local.size,
      listStyleType: local.listStyleType,
      center: local.center,
      spacing: local.spacing,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      name: "List",
      unstyled: local.unstyled,
    }
  );

  return (
    <StylesApiProvider
      classNames={local.classNames}
      styles={local.styles}
      unstyled={local.unstyled}
    >
      <ListContext.Provider
        value={{
          spacing: local.spacing,
          center: local.center,
          icon: local.icon,
          listStyleType: local.listStyleType,
          size: local.size,
          withPadding: local.withPadding,
        }}
      >
        <Box<any>
          component={local.type === "unordered" ? "ul" : "ol"}
          className={cx(classes.root, local.className)}
          {...others}
        />
      </ListContext.Provider>
    </StylesApiProvider>
  );
};

List.Item = ListItem;
List.displayName = "@mantine/core/List";
