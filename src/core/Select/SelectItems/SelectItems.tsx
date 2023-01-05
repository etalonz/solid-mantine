import { DefaultProps, MantineSize, Selectors } from "styles";
import { Text } from "../../Text/Text";
import { Divider } from "../../Divider/Divider";
import { SelectItem } from "../types";
import useStyles from "./SelectItems.styles";
import {
  Component,
  createEffect,
  createSignal,
  JSXElement,
  on,
  Show,
} from "solid-js";

export type SelectItemsStylesNames = Selectors<typeof useStyles>;

export interface SelectItemsProps extends DefaultProps<SelectItemsStylesNames> {
  data: SelectItem[];
  hovered: number;
  __staticSelector: string;
  isItemSelected?(itemValue: string): boolean;
  uuid: string;
  itemsRefs?: Record<string, HTMLDivElement>;
  onItemHover(index: number): void;
  onItemSelect(item: SelectItem): void;
  size: MantineSize;
  itemComponent: Component<any>;
  nothingFound?: JSXElement;
  creatable?: boolean;
  createLabel?: JSXElement;
}

export function SelectItems(p: SelectItemsProps) {
  const { classes } = useStyles(
    { size: p.size },
    {
      classNames: p.classNames,
      styles: p.styles,
      unstyled: p.unstyled,
      name: p.__staticSelector,
    }
  );

  const [unGroupedItems, setUnGroupedItems] = createSignal<JSXElement[]>([]);
  const [groupedItems, setGroupedItems] = createSignal<JSXElement[]>([]);

  const constructItemComponent = (item: SelectItem, index: number) => {
    const selected =
      typeof p.isItemSelected === "function"
        ? p.isItemSelected(item.value)
        : false;
    return () => (
      <p.itemComponent
        key={item.value}
        className={classes.item}
        data-disabled={item.disabled || undefined}
        data-hovered={(!item.disabled && p.hovered === index) || undefined}
        data-selected={(!item.disabled && selected) || undefined}
        onMouseEnter={() => p.onItemHover(index)}
        id={`${p.uuid}-${index}`}
        role="option"
        // data-ignore-outside-clicks
        tabIndex={-1}
        aria-selected={p.hovered === index}
        ref={(node: HTMLDivElement) => {
          if (p.itemsRefs) {
            // eslint-disable-next-line no-param-reassign
            p.itemsRefs[item.value] = node;
          }
        }}
        onMouseDown={
          !item.disabled
            ? (event: MouseEvent) => {
                event.preventDefault();
                p.onItemSelect(item);
              }
            : null
        }
        disabled={item.disabled}
        {...item}
      />
    );
  };

  createEffect(
    on([() => p.data, () => p.creatable], ([data, creatable]) => {
      const unGroupedItems: JSXElement[] = [];
      const groupedItems: JSXElement[] = [];

      let creatableDataIndex = null;
      let groupName = null;

      data.forEach((item, index) => {
        if (item.creatable) {
          creatableDataIndex = index;
        } else if (!item.group) {
          unGroupedItems.push(constructItemComponent(item, index));
        } else {
          if (groupName !== item.group) {
            groupName = item.group;
            groupedItems.push(() => (
              <div class={classes.separator}>
                <Divider
                  classNames={{ label: classes.separatorLabel }}
                  label={item.group}
                />
              </div>
            ));
          }
          groupedItems.push(constructItemComponent(item, index));
        }
      });

      if (creatable) {
        const creatableDataItem = data[creatableDataIndex];
        unGroupedItems.push(() => (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            class={classes.item}
            data-hovered={p.hovered === creatableDataIndex || undefined}
            onMouseEnter={() => p.onItemHover(creatableDataIndex)}
            onMouseDown={(event: MouseEvent) => {
              event.preventDefault();
              p.onItemSelect(creatableDataItem);
            }}
            tabIndex={-1}
            ref={(node: HTMLDivElement) => {
              if (p.itemsRefs) {
                // eslint-disable-next-line no-param-reassign
                p.itemsRefs[creatableDataItem.value] = node;
              }
            }}
          >
            {p.createLabel}
          </div>
        ));
      }

      if (groupedItems.length > 0 && unGroupedItems.length > 0) {
        unGroupedItems.unshift(() => (
          <div class={classes.separator}>
            <Divider />
          </div>
        ));
      }

      setGroupedItems(groupedItems);
      setUnGroupedItems(unGroupedItems);
    })
  );

  return (
    <Show
      when={groupedItems().length > 0 || unGroupedItems().length > 0}
      fallback={() => (
        <Text
          size={p.size}
          unstyled={p.unstyled}
          className={classes.nothingFound}
        >
          {p.nothingFound}
        </Text>
      )}
    >
      {groupedItems()}
      {unGroupedItems()}
    </Show>
  );
}

SelectItems.displayName = "@mantine/core/SelectItems";
