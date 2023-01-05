import { useUncontrolled } from "hooks";
import { Component, DefaultProps, getDefaultZIndex } from "styles";
import { groupOptions } from "utils";
import {
  Input,
  InputWrapperBaseProps,
  InputSharedProps,
  useInputProps,
} from "../Input";
import { SelectStylesNames } from "../Select";
import { SelectItems } from "../Select/SelectItems/SelectItems";
import { DefaultItem } from "../Select/DefaultItem/DefaultItem";
import { SelectPopover } from "../Select/SelectPopover/SelectPopover";
import { SelectScrollArea } from "../Select/SelectScrollArea/SelectScrollArea";
import { filterData } from "./filter-data/filter-data";
import useStyles from "./Autocomplete.styles";
import { SelectSharedProps } from "../Select/Select";
import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  splitProps,
  untrack,
} from "solid-js";
import { mergeRefs } from "@solid-primitives/refs";
import { Box } from "../Box";

export type AutocompleteStylesNames = SelectStylesNames;

export interface AutocompleteItem {
  value: string;
  [key: string]: any;
}

export interface AutocompleteProps
  extends DefaultProps<AutocompleteStylesNames>,
    InputSharedProps,
    InputWrapperBaseProps,
    SelectSharedProps<AutocompleteItem, string>,
    Omit<
      ComponentProps<"input">,
      "size" | "onChange" | "value" | "defaultValue"
    > {
  /** Maximum dropdown height */
  maxDropdownHeight?: number | string;

  /** Change dropdown component, can be used to add native scrollbars */
  dropdownComponent?: any;

  /** Called when item from dropdown was selected */
  onItemSubmit?(item: AutocompleteItem): void;
}

export function defaultFilter(value: string, item: AutocompleteItem) {
  return item.value.toLowerCase().trim().includes(value.toLowerCase().trim());
}

const defaultProps: Partial<AutocompleteProps> = {
  required: false,
  size: "sm",
  shadow: "sm",
  limit: 5,
  itemComponent: DefaultItem,
  transition: "pop",
  transitionDuration: 0,
  initiallyOpened: false,
  filter: defaultFilter,
  switchDirectionOnFlip: false,
  zIndex: getDefaultZIndex("popover"),
  dropdownPosition: "flip",
  maxDropdownHeight: "auto",
  positionDependencies: [],
};

export const Autocomplete: Component<AutocompleteProps> = (props) => {
  const [local, others] = splitProps(
    useInputProps("Autocomplete", defaultProps, props),
    [
      "ref",
      "inputProps",
      "wrapperProps",
      "shadow",
      "data",
      "limit",
      "value",
      "defaultValue",
      "onChange",
      "unstyled",
      "itemComponent",
      "onItemSubmit",
      "onKeyDown",
      "onFocus",
      "onBlur",
      "onClick",
      "transition",
      "transitionDuration",
      "initiallyOpened",
      "transitionTimingFunction",
      "classNames",
      "styles",
      "filter",
      "nothingFound",
      "onDropdownClose",
      "onDropdownOpen",
      "withinPortal",
      "switchDirectionOnFlip",
      "zIndex",
      "dropdownPosition",
      "maxDropdownHeight",
      "dropdownComponent",
      "positionDependencies",
      "readOnly",
    ]
  );

  const { classes } = useStyles(null, {
    classNames: local.classNames,
    styles: local.styles,
    name: "Autocomplete",
    unstyled: local.unstyled,
  });

  const [dropdownOpened, _setDropdownOpened] = createSignal(
    local.initiallyOpened
  );
  const [hovered, setHovered] = createSignal(-1);
  const [direction, setDirection] =
    createSignal<JSX.CSSProperties["flex-direction"]>("column");

  let inputRef: HTMLInputElement = null;

  const [IMEOpen, setIMEOpen] = createSignal(false);
  const [_value, handleChange] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: "",
    onChange: local.onChange,
  });

  const setDropdownOpened = (opened: boolean) => {
    _setDropdownOpened(opened);
    const handler = opened ? local.onDropdownOpen : local.onDropdownClose;
    typeof handler === "function" && handler();
  };

  createEffect(on(_value, () => setHovered(-1), { defer: true }));

  const handleItemClick = (item: AutocompleteItem) => {
    handleChange(item.value);
    typeof local.onItemSubmit === "function" && local.onItemSubmit(item);
    setDropdownOpened(false);
  };

  const formattedData = createMemo(() =>
    local.data.map((item) =>
      typeof item === "string" ? { value: item } : item
    )
  );

  const filteredData = createMemo(() =>
    groupOptions({
      data: filterData({
        data: untrack(formattedData),
        value: untrack(_value),
        limit: local.limit,
        filter: local.filter,
      }),
    })
  );

  const handleInputKeydown = (event: KeyboardEvent) => {
    if (IMEOpen()) {
      return;
    }

    typeof local.onKeyDown === "function" && local.onKeyDown(event);

    const isColumn = direction() === "column";

    const handleNext = () => {
      setHovered((current) =>
        current < filteredData().length - 1 ? current + 1 : current
      );
    };

    const handlePrevious = () => {
      setHovered((current) => (current > 0 ? current - 1 : current));
    };

    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        isColumn ? handlePrevious() : handleNext();
        break;
      }

      case "ArrowDown": {
        event.preventDefault();
        isColumn ? handleNext() : handlePrevious();
        break;
      }

      case "Enter": {
        if (filteredData()[hovered()] && dropdownOpened()) {
          event.preventDefault();
          handleChange(filteredData()[hovered()].value);
          typeof local.onItemSubmit === "function" &&
            local.onItemSubmit(filteredData()[hovered()]);
          setDropdownOpened(false);
        }
        break;
      }

      case "Escape": {
        if (dropdownOpened()) {
          event.preventDefault();
          setDropdownOpened(false);
        }
      }
    }
  };

  const handleInputFocus = (event: FocusEvent) => {
    typeof local.onFocus === "function" && local.onFocus(event);
    setDropdownOpened(true);
  };

  const handleInputBlur = (event: FocusEvent) => {
    typeof local.onBlur === "function" && local.onBlur(event);
    setDropdownOpened(false);
  };

  const handleInputClick = (event: MouseEvent) => {
    typeof local.onClick === "function" && local.onClick(event);
    setDropdownOpened(true);
  };

  const shouldRenderDropdown = createMemo(
    () =>
      dropdownOpened() &&
      (filteredData().length > 0 ||
        (filteredData().length === 0 && !!local.nothingFound))
  );

  return (
    <Input.Wrapper {...local.wrapperProps} __staticSelector="Autocomplete">
      <SelectPopover
        opened={shouldRenderDropdown()}
        transition={local.transition}
        transitionDuration={local.transitionDuration}
        shadow="sm"
        withinPortal={local.withinPortal}
        __staticSelector="Autocomplete"
        onDirectionChange={setDirection}
        switchDirectionOnFlip={local.switchDirectionOnFlip}
        zIndex={local.zIndex}
        dropdownPosition={local.dropdownPosition}
        positionDependencies={local.positionDependencies}
        classNames={local.classNames}
        styles={local.styles}
        unstyled={local.unstyled}
        readOnly={local.readOnly}
      >
        <SelectPopover.Target>
          <Box
            className={classes.wrapper}
            role="combobox"
            aria-haspopup="listbox"
            aria-owns={
              shouldRenderDropdown() ? `${local.inputProps.id}-items` : null
            }
            aria-controls={local.inputProps.id}
            aria-expanded={shouldRenderDropdown()}
            onMouseLeave={() => setHovered(-1)}
            tabIndex={-1}
          >
            <Input<"input">
              type="search"
              autocomplete="off"
              {...local.inputProps}
              {...others}
              readOnly={local.readOnly}
              data-mantine-stop-propagation={dropdownOpened()}
              ref={mergeRefs((r) => (inputRef = r), local.ref)}
              onKeyDown={handleInputKeydown}
              classNames={local.classNames}
              styles={local.styles}
              __staticSelector="Autocomplete"
              value={_value()}
              onChange={(event) => {
                handleChange(event.currentTarget.value);
                setDropdownOpened(true);
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onClick={handleInputClick}
              onCompositionStart={() => setIMEOpen(true)}
              onCompositionEnd={() => setIMEOpen(false)}
              aria-autocomplete="list"
              aria-controls={
                shouldRenderDropdown() ? `${local.inputProps.id}-items` : null
              }
              aria-activedescendant={
                hovered() >= 0 ? `${local.inputProps.id}-${hovered()}` : null
              }
            />
          </Box>
        </SelectPopover.Target>

        <SelectPopover.Dropdown
          component={local.dropdownComponent || SelectScrollArea}
          maxHeight={local.maxDropdownHeight}
          direction={direction()}
          id={local.inputProps.id}
          __staticSelector="Autocomplete"
          classNames={local.classNames}
          styles={local.styles}
        >
          <SelectItems
            data={filteredData()}
            hovered={hovered()}
            classNames={local.classNames}
            styles={local.styles}
            uuid={local.inputProps.id}
            __staticSelector="Autocomplete"
            onItemHover={setHovered}
            onItemSelect={handleItemClick}
            itemComponent={local.itemComponent}
            size={local.inputProps.size}
            nothingFound={local.nothingFound}
          />
        </SelectPopover.Dropdown>
      </SelectPopover>
    </Input.Wrapper>
  );
};

Autocomplete.displayName = "@mantine/core/Autocomplete";
