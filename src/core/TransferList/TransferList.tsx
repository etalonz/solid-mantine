import {
  DefaultProps,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { useUncontrolled } from "hooks";
import { RenderList, RenderListStylesNames } from "./RenderList/RenderList";
import { SelectScrollArea } from "../Select/SelectScrollArea/SelectScrollArea";
import { DefaultItem } from "./DefaultItem/DefaultItem";
import { SimpleGrid } from "../SimpleGrid";
import {
  useSelectionState,
  Selection,
} from "./use-selection-state/use-selection-state";
import {
  TransferListData,
  TransferListItemComponent,
  TransferListItem,
} from "./types";
import {
  Component,
  ComponentProps,
  createMemo,
  JSXElement,
  splitProps,
} from "solid-js";

export type TransferListStylesNames = RenderListStylesNames;

export interface TransferListProps
  extends DefaultProps<TransferListStylesNames>,
    Omit<ComponentProps<"div">, "value" | "onChange" | "placeholder"> {
  /** Current value */
  value: TransferListData;

  /** Called when value changes */
  onChange(value: TransferListData): void;

  /** Initial items selection */
  initialSelection?: Selection;

  /** Custom item component */
  itemComponent?: TransferListItemComponent;

  /** Controlled search queries */
  searchValues?: [string, string];

  /** Called when one of the search queries changes */
  onSearch?(value: [string, string]): void;

  /** Search fields placeholder */
  searchPlaceholder?: string | [string, string];

  /** Nothing found message */
  nothingFound?: JSXElement | [JSXElement, JSXElement];

  /** Displayed when a list is empty and there is no search query */
  placeholder?: JSXElement | [JSXElement, JSXElement];

  /** Function to filter search results */
  filter?(query: string, item: TransferListItem): boolean;

  /** Lists titles */
  titles?: [string, string];

  /** List items height */
  listHeight?: number;

  /** Change list component, can be used to add custom scrollbars */
  listComponent?: any;

  /** Breakpoint at which list will collapse to single column layout */
  breakpoint?: MantineNumberSize;

  /** Predefined border-radius value from theme.radius or number for border-radius in px */
  radius?: MantineNumberSize;

  /** Whether to hide the transfer all button */
  showTransferAll?: boolean;

  /** Limit amount of items showed at a time */
  limit?: number;

  /** Change icon used for the transfer selected control */
  transferIcon?: Component<{ reversed: boolean }>;

  /** Change icon used for the transfer all control */
  transferAllIcon?: Component<{ reversed: boolean }>;
}

export function defaultFilter(query: string, item: TransferListItem) {
  return item.label.toLowerCase().trim().includes(query.toLowerCase().trim());
}

const defaultProps: Partial<TransferListProps> = {
  itemComponent: DefaultItem,
  filter: defaultFilter,
  titles: [null, null],
  placeholder: [null, null],
  listHeight: 150,
  listComponent: SelectScrollArea,
  showTransferAll: true,
  limit: Infinity,
};

export const TransferList = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("TransferList", defaultProps, props),
    [
      "value",
      "onChange",
      "itemComponent",
      "searchPlaceholder",
      "searchValues",
      "onSearch",
      "filter",
      "nothingFound",
      "placeholder",
      "titles",
      "initialSelection",
      "listHeight",
      "listComponent",
      "showTransferAll",
      "breakpoint",
      "radius",
      "classNames",
      "styles",
      "limit",
      "unstyled",
      "transferIcon",
      "transferAllIcon",
    ]
  );

  const [selection, handlers] = useSelectionState(local.initialSelection);
  const [search, handleSearch] = useUncontrolled({
    value: () => local.searchValues,
    defaultValue: ["", ""],
    finalValue: ["", ""],
    onChange: local.onSearch,
  });

  const handleMoveAll = (listIndex: 0 | 1) => {
    const items: TransferListData = Array(2) as any;
    const moveToIndex = listIndex === 0 ? 1 : 0;
    items[listIndex] = [];
    items[moveToIndex] = [
      ...local.value[moveToIndex],
      ...local.value[listIndex],
    ];
    local.onChange(items);
    handlers.deselectAll(listIndex);
  };

  const handleMove = (listIndex: 0 | 1) => {
    const moveToIndex = listIndex === 0 ? 1 : 0;
    const items: TransferListData = Array(2) as any;
    const transferData = local.value[listIndex].reduce(
      (acc, item) => {
        if (!selection[listIndex].includes(item.value)) {
          acc.filtered.push(item);
        } else {
          acc.current.push(item);
        }
        return acc;
      },
      { filtered: [], current: [] }
    );
    items[listIndex] = transferData.filtered;
    items[moveToIndex] = [...transferData.current, ...local.value[moveToIndex]];
    local.onChange(items);
    handlers.deselectAll(listIndex);
  };

  const breakpoints = createMemo(() =>
    local.breakpoint ? [{ maxWidth: local.breakpoint, cols: 1 }] : []
  );

  const sharedListProps = createMemo(() => ({
    itemComponent: local.itemComponent,
    listComponent: local.listComponent,
    transferIcon: local.transferIcon,
    transferAllIcon: local.transferAllIcon,
    filter: local.filter,
    height: local.listHeight,
    showTransferAll: local.showTransferAll,
    classNames: local.classNames,
    styles: local.styles,
    limit: local.limit,
    radius: local.radius,
  }));

  return (
    <SimpleGrid
      cols={2}
      spacing="xl"
      breakpoints={breakpoints()}
      unstyled={local.unstyled}
      {...others}
    >
      <RenderList
        {...sharedListProps()}
        data={local.value[0]}
        selection={selection()[0]}
        onSelect={(val) => handlers.select(0, val)}
        onMoveAll={() => handleMoveAll(0)}
        onMove={() => handleMove(0)}
        title={local.titles[0]}
        placeholder={
          Array.isArray(local.placeholder)
            ? local.placeholder[0]
            : local.placeholder
        }
        searchPlaceholder={
          Array.isArray(local.searchPlaceholder)
            ? local.searchPlaceholder[0]
            : local.searchPlaceholder
        }
        nothingFound={
          Array.isArray(local.nothingFound)
            ? local.nothingFound[0]
            : local.nothingFound
        }
        query={search()[0]}
        onSearch={(query) => handleSearch([query, search()[1]])}
        unstyled={local.unstyled}
      />

      <RenderList
        {...sharedListProps()}
        data={local.value[1]}
        selection={selection()[1]}
        onSelect={(val) => handlers.select(1, val)}
        onMoveAll={() => handleMoveAll(1)}
        onMove={() => handleMove(1)}
        title={local.titles[1]}
        placeholder={
          Array.isArray(local.placeholder)
            ? local.placeholder[1]
            : local.placeholder
        }
        searchPlaceholder={
          Array.isArray(local.searchPlaceholder)
            ? local.searchPlaceholder[1]
            : local.searchPlaceholder
        }
        nothingFound={
          Array.isArray(local.nothingFound)
            ? local.nothingFound[1]
            : local.nothingFound
        }
        query={search()[1]}
        onSearch={(query) => handleSearch([search()[0], query])}
        reversed
        unstyled={local.unstyled}
      />
    </SimpleGrid>
  );
};

TransferList.displayName = "@mantine/core/TransferList";
