import { DefaultProps, Selectors, MantineNumberSize } from "styles";
import { useScrollIntoView } from "hooks";
import { groupOptions } from "utils";
import { SelectScrollArea } from "../../Select/SelectScrollArea/SelectScrollArea";
import { UnstyledButton } from "../../UnstyledButton";
import { ActionIcon } from "../../ActionIcon";
import { TextInput } from "../../TextInput";
import { Text } from "../../Text";
import { Divider } from "../../Divider";
import {
  LastIcon,
  NextIcon,
  FirstIcon,
  PrevIcon,
} from "../../Pagination/icons";
import { TransferListItem, TransferListItemComponent } from "../types";
import useStyles from "./RenderList.styles";
import {
  Accessor,
  Component,
  createEffect,
  createMemo,
  createSignal,
  JSXElement,
  Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";

export type RenderListStylesNames = Selectors<typeof useStyles>;

export interface RenderListProps extends DefaultProps<RenderListStylesNames> {
  data: TransferListItem[];
  onSelect(value: string): void;
  selection: string[];
  itemComponent: TransferListItemComponent;
  searchPlaceholder: string;
  query?: string;
  onSearch(value: string): void;
  filter(query: string, item: TransferListItem): boolean;
  nothingFound?: JSXElement;
  placeholder?: JSXElement;
  title?: JSXElement;
  reversed?: boolean;
  showTransferAll?: boolean;
  onMoveAll(): void;
  onMove(): void;
  height: number;
  radius: MantineNumberSize;
  listComponent?: Component<any>;
  limit?: number;
  transferIcon?: Component<{ reversed }>;
  transferAllIcon?: Component<{ reversed }>;
}

const icons = {
  Prev: PrevIcon,
  Next: NextIcon,
  First: FirstIcon,
  Last: LastIcon,
};

const rtlIons = {
  Next: PrevIcon,
  Prev: NextIcon,
  Last: FirstIcon,
  First: LastIcon,
};

export function RenderList(props: RenderListProps) {
  const { classes, cx, theme } = useStyles(
    {
      reversed: props.reversed,
      native: props.listComponent !== SelectScrollArea,
      radius: props.radius,
    },
    {
      name: "TransferList",
      classNames: props.classNames,
      styles: props.styles,
      unstyled: props.unstyled,
    }
  );

  let unGroupedItems: JSXElement[] = [];
  let groupedItems: JSXElement[] = [];

  const [hovered, setHovered] = createSignal(-1);

  const filteredData = createMemo(() =>
    props.data
      .filter((item) => props.filter(props.query, item))
      .slice(0, props.limit)
  );

  const Icons = createMemo(() => (theme.dir === "rtl" ? rtlIons : icons));

  const itemsRefs: Record<string, HTMLButtonElement> = {};

  const sortedData: Accessor<TransferListItem[]> = createMemo(() =>
    groupOptions({ data: filteredData() })
  );

  const { scrollIntoView, setScrollableRef, setTargetRef } = useScrollIntoView({
    duration: 0,
    offset: 5,
    cancelable: false,
    isList: true,
  });

  let groupName = null;

  createEffect(() => {
    groupedItems = [];
    unGroupedItems = [];

    sortedData().forEach((item, index) => {
      const itemComponent = (
        <UnstyledButton
          unstyled={props.unstyled}
          tabIndex={-1}
          onClick={() => props.onSelect(item.value)}
          onMouseEnter={() => setHovered(index)}
          className={cx(classes.transferListItem, {
            [classes.transferListItemHovered]: index === hovered(),
          })}
          ref={(node: HTMLButtonElement) => {
            if (itemsRefs && itemsRefs) {
              itemsRefs[item.value] = node;
            }
          }}
        >
          <props.itemComponent
            data={item}
            selected={props.selection.includes(item.value)}
            radius={props.radius}
          />
        </UnstyledButton>
      );

      if (!item.group) {
        unGroupedItems.push(itemComponent);
      } else {
        if (groupName !== item.group) {
          groupName = item.group;
          groupedItems.push(
            <div class={classes.separator}>
              <Divider
                classNames={{ label: classes.separatorLabel }}
                label={groupName}
              />
            </div>
          );
        }
        groupedItems.push(itemComponent);
      }
    });

    if (groupedItems.length > 0 && unGroupedItems.length > 0) {
      unGroupedItems.unshift(
        <div class={classes.separator}>
          <Divider
            unstyled={props.unstyled}
            classNames={{ label: classes.separatorLabel }}
          />
        </div>
      );
    }
  });

  const handleSearchKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        if (filteredData()[hovered()]) {
          props.onSelect(filteredData()[hovered()].value);
        }
        break;
      }

      case "ArrowDown": {
        event.preventDefault();
        setHovered((current) => {
          const nextIndex =
            current < filteredData().length - 1 ? current + 1 : current;

          setTargetRef(itemsRefs[filteredData()[nextIndex]?.value]);

          scrollIntoView({
            alignment: "end",
          });

          return nextIndex;
        });
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        setHovered((current) => {
          const nextIndex = current > 0 ? current - 1 : current;

          setTargetRef(itemsRefs[filteredData()[nextIndex]?.value]);

          scrollIntoView({
            alignment: "start",
          });

          return nextIndex;
        });
      }
    }
  };

  const transferIcon = createMemo(() =>
    props.reversed ? Icons().Prev({}) : Icons().Next({})
  );
  const transferAllIcon = createMemo(() =>
    props.reversed ? Icons().First({}) : Icons().Last({})
  );

  return (
    <div class={cx(classes.transferList, props.className)}>
      <Show when={props.title}>
        <Text
          weight={500}
          unstyled={props.unstyled}
          className={classes.transferListTitle}
        >
          {props.title}
        </Text>
      </Show>

      <div class={classes.transferListBody}>
        <div class={classes.transferListHeader}>
          <TextInput
            unstyled={props.unstyled}
            value={props.query}
            onChange={(event) => {
              props.onSearch(event.currentTarget.value);
              setHovered(0);
            }}
            onFocus={() => setHovered(0)}
            onBlur={() => setHovered(-1)}
            placeholder={props.searchPlaceholder}
            radius={0}
            onKeyDown={handleSearchKeydown}
            sx={{ flex: 1 }}
            classNames={{ input: classes.transferListSearch }}
          />

          <ActionIcon
            variant="default"
            size={36}
            radius={0}
            className={classes.transferListControl}
            disabled={props.selection.length === 0}
            onClick={props.onMove}
            unstyled={props.unstyled}
          >
            <Show when={props.transferIcon} fallback={transferIcon()}>
              <props.transferIcon reversed={props.reversed} />
            </Show>
          </ActionIcon>

          <Show when={props.showTransferAll}>
            <ActionIcon
              variant="default"
              size={36}
              radius={0}
              className={classes.transferListControl}
              disabled={props.data.length === 0}
              onClick={props.onMoveAll}
              unstyled={props.unstyled}
            >
              <Show when={props.transferAllIcon} fallback={transferAllIcon()}>
                <props.transferAllIcon reversed={props.reversed} />
              </Show>
            </ActionIcon>
          </Show>
        </div>

        <Dynamic
          component={props.listComponent || "div"}
          ref={setScrollableRef}
          onMouseLeave={() => setHovered(-1)}
          className={classes.transferListItems}
          style={{
            height: props.height,
            position: "relative",
            overflowX: "hidden",
          }}
        >
          <Show
            when={groupedItems.length > 0 || unGroupedItems.length > 0}
            fallback={
              <Text
                color="dimmed"
                unstyled={props.unstyled}
                size="sm"
                align="center"
                mt="sm"
              >
                {!props.query && props.placeholder
                  ? props.placeholder
                  : props.nothingFound}
              </Text>
            }
          >
            {groupedItems}
            {unGroupedItems}
          </Show>
        </Dynamic>
      </div>
    </div>
  );
}

RenderList.displayName = "@mantine/core/RenderList";
