import { useUncontrolled, useScrollIntoView } from "hooks";
import {
  DefaultProps,
  MantineSize,
  MantineShadow,
  getDefaultZIndex,
  ComponentWithRef,
} from "styles";
import { groupOptions } from "utils";
import { SelectScrollArea } from "./SelectScrollArea/SelectScrollArea";
import { Input, useInputProps } from "../Input";
import { MantineTransition } from "../Transition";
import { DefaultItem } from "./DefaultItem/DefaultItem";
import { getSelectRightSectionProps } from "./SelectRightSection/get-select-right-section-props";
import { SelectItems } from "./SelectItems/SelectItems";
import { SelectPopover } from "./SelectPopover/SelectPopover";
import { SelectItem, BaseSelectStylesNames, BaseSelectProps } from "./types";
import { filterData } from "./filter-data/filter-data";
import useStyles from "./Select.styles";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  JSXElement,
  on,
  splitProps,
} from "solid-js";
import { mergeRefs } from "@solid-primitives/refs";
import { Box } from "../Box";

export interface SelectSharedProps<Item, Value> {
  /** Select data used to renderer items in dropdown */
  data: (string | Item)[];

  /** Controlled input value */
  value?: Value;

  /** Uncontrolled input defaultValue */
  defaultValue?: Value;

  /** Controlled input onChange handler */
  onChange?(value: Value): void;

  /** Function based on which items in dropdown are filtered */
  filter?(value: string, item: Item): boolean;

  /** Input size */
  size?: MantineSize;

  /** Dropdown body appear/disappear transition */
  transition?: MantineTransition;

  /** Dropdown body transition duration */
  transitionDuration?: number;

  /** Dropdown body transition timing function, defaults to theme.transitionTimingFunction */
  transitionTimingFunction?: string;

  /** Dropdown shadow from theme or any value to set box-shadow */
  shadow?: MantineShadow;

  /** Initial dropdown opened state */
  initiallyOpened?: boolean;

  /** Change item renderer */
  itemComponent?: Component<any>;

  /** Called when dropdown is opened */
  onDropdownOpen?(): void;

  /** Called when dropdown is closed */
  onDropdownClose?(): void;

  /** Whether to render the dropdown in a Portal */
  withinPortal?: boolean;

  /** Limit amount of items displayed at a time for searchable select */
  limit?: number;

  /** Nothing found label */
  nothingFound?: JSXElement;

  /** Dropdown z-index */
  zIndex?: JSX.CSSProperties["z-index"];

  /** Dropdown positioning behavior */
  dropdownPosition?: "bottom" | "top" | "flip";

  /** Whether to switch item order and keyboard navigation on dropdown position flip */
  switchDirectionOnFlip?: boolean;

  /** useEffect dependencies to force update dropdown position */
  positionDependencies?: any[];
}

export interface SelectProps
  extends DefaultProps<BaseSelectStylesNames>,
    BaseSelectProps,
    SelectSharedProps<SelectItem, string | null> {
  /** Maximum dropdown height in px */
  maxDropdownHeight?: number;

  /** Set to true to enable search */
  searchable?: boolean;

  /** Allow to clear item */
  clearable?: boolean;

  /** aria-label for clear button */
  clearButtonLabel?: string;

  /** Called each time search value changes */
  onSearchChange?(query: string): void;

  /** Controlled search input value */
  searchValue?: string;

  /** Allow creatable option  */
  creatable?: boolean;

  /** Function to get create Label */
  getCreateLabel?(query: string): JSXElement;

  /** Function to determine if create label should be displayed */
  shouldCreate?(query: string, data: SelectItem[]): boolean;

  /** Called when create option is selected */
  onCreate?(query: string): SelectItem | string | null | undefined;

  /** Change dropdown component, can be used to add native scrollbars */
  dropdownComponent?: any;

  /** Select highlighted item on blur */
  selectOnBlur?: boolean;

  /** Allow deselecting items on click */
  allowDeselect?: boolean;

  /** Should data be filtered when search value exactly matches selected item */
  filterDataOnExactSearchMatch?: boolean;

  /** Set the clear button tab index to disabled or default after input field */
  clearButtonTabIndex?: -1 | 0;
}

export function defaultFilter(value: string, item: SelectItem) {
  return item.label.toLowerCase().trim().includes(value.toLowerCase().trim());
}

export function defaultShouldCreate(query: string, data: SelectItem[]) {
  return (
    !!query &&
    !data.some((item) => item.label.toLowerCase() === query.toLowerCase())
  );
}

const defaultProps: Partial<SelectProps> = {
  required: false,
  size: "sm",
  shadow: "sm",
  itemComponent: DefaultItem,
  transition: "fade",
  transitionDuration: 0,
  initiallyOpened: false,
  filter: defaultFilter,
  maxDropdownHeight: 220,
  searchable: false,
  clearable: false,
  limit: Infinity,
  disabled: false,
  creatable: false,
  shouldCreate: defaultShouldCreate,
  selectOnBlur: false,
  switchDirectionOnFlip: false,
  filterDataOnExactSearchMatch: false,
  zIndex: getDefaultZIndex("popover"),
  clearButtonTabIndex: 0,
  positionDependencies: [],
  dropdownPosition: "flip",
};

export const Select: ComponentWithRef<SelectProps, HTMLInputElement> = (
  props
) => {
  const [local, others] = splitProps(
    useInputProps("Select", defaultProps, props),
    [
      "ref",
      "inputProps",
      "wrapperProps",
      "shadow",
      "data",
      "value",
      "defaultValue",
      "onChange",
      "itemComponent",
      "onKeyDown",
      "onBlur",
      "onFocus",
      "transition",
      "transitionDuration",
      "initiallyOpened",
      "transitionTimingFunction",
      "unstyled",
      "classNames",
      "styles",
      "filter",
      "maxDropdownHeight",
      "searchable",
      "clearable",
      "nothingFound",
      "clearButtonLabel",
      "limit",
      "disabled",
      "onSearchChange",
      "searchValue",
      "rightSection",
      "rightSectionWidth",
      "creatable",
      "getCreateLabel",
      "shouldCreate",
      "selectOnBlur",
      "onCreate",
      "dropdownComponent",
      "onDropdownClose",
      "onDropdownOpen",
      "withinPortal",
      "switchDirectionOnFlip",
      "zIndex",
      "name",
      "dropdownPosition",
      "allowDeselect",
      "placeholder",
      "filterDataOnExactSearchMatch",
      "clearButtonTabIndex",
      "form",
      "positionDependencies",
      "readOnly",
    ]
  );

  const { classes, cx, theme } = useStyles();

  const [dropdownOpened, _setDropdownOpened] = createSignal(
    local.initiallyOpened
  );
  const [hovered, setHovered] = createSignal(-1);

  let inputRef: HTMLInputElement;
  let itemsRefs: Record<string, HTMLDivElement> = {};

  const [direction, setDirection] =
    createSignal<JSX.CSSProperties["flex-direction"]>("column");

  const isColumn = createMemo(() => direction() === "column");

  const { scrollIntoView, setTargetRef, setScrollableRef } = useScrollIntoView({
    duration: 0,
    offset: 5,
    cancelable: false,
    isList: true,
  });

  const isDeselectable = createMemo(() =>
    local.allowDeselect === undefined ? local.clearable : local.allowDeselect
  );

  const setDropdownOpened = (opened: boolean) => {
    if (dropdownOpened() !== opened) {
      _setDropdownOpened(opened);
      const handler = opened ? local.onDropdownOpen : local.onDropdownClose;
      typeof handler === "function" && handler();
    }
  };

  const isCreatable = createMemo(
    () => local.creatable && typeof local.getCreateLabel === "function"
  );

  let createLabel = null;

  const formattedData = createMemo(() =>
    local.data.map((item) =>
      typeof item === "string" ? { label: item, value: item } : item
    )
  );

  const sortedData = createMemo(() => groupOptions({ data: formattedData() }));

  const [_value, handleChange, controlled] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue,
    finalValue: null,
    onChange: local.onChange as any,
  });

  const selectedValue = createMemo(() =>
    sortedData().find((item) => item.value === _value())
  );

  const [inputValue, setInputValue] = useUncontrolled({
    value: () => local.searchValue,
    defaultValue: selectedValue()?.label || "",
    finalValue: undefined,
    onChange: local.onSearchChange,
  });

  const handleSearchChange = (val: string) => {
    setInputValue(val);
    if (local.searchable && typeof local.onSearchChange === "function") {
      local.onSearchChange(val);
    }
  };

  const handleClear = () => {
    if (!local.readOnly) {
      handleChange(null);
      if (!controlled) {
        handleSearchChange("");
      }
      inputRef?.focus();
    }
  };

  createEffect(
    on(_value, () => {
      const newSelectedValue = sortedData().find(
        (item) => item.value === _value()
      );

      if (newSelectedValue) {
        handleSearchChange(newSelectedValue.label);
      } else if (!isCreatable() || !_value()) {
        handleSearchChange("");
      }
    })
  );

  createEffect(
    on(
      () => selectedValue()?.label,
      () => {
        if (selectedValue() && (!local.searchable || !dropdownOpened())) {
          handleSearchChange(selectedValue().label);
        }
      }
    )
  );

  const handleItemSelect = (item: SelectItem) => {
    if (!local.readOnly) {
      if (isDeselectable() && selectedValue()?.value === item.value) {
        handleChange(null);
        setDropdownOpened(false);
      } else {
        if (item.creatable && typeof local.onCreate === "function") {
          const createdItem = local.onCreate(item.value);
          if (typeof createdItem !== "undefined" && createdItem !== null) {
            if (typeof createdItem === "string") {
              handleChange(createdItem);
            } else {
              handleChange(createdItem.value);
            }
          }
        } else {
          handleChange(item.value);
        }

        if (!controlled) {
          handleSearchChange(item.label);
        }

        setHovered(-1);
        setDropdownOpened(false);
        inputRef.focus();
      }
    }
  };

  const filteredData = createMemo(() => {
    const fd = filterData({
      data: sortedData(),
      searchable: local.searchable,
      limit: local.limit,
      searchValue: inputValue(),
      filter: local.filter,
      filterDataOnExactSearchMatch: local.filterDataOnExactSearchMatch,
      value: _value(),
    });

    if (isCreatable() && local.shouldCreate(inputValue(), fd)) {
      createLabel = local.getCreateLabel(inputValue());
      fd.push({
        label: inputValue,
        value: inputValue,
        creatable: true,
      });
    }

    return fd;
  });

  const getNextIndex = (
    index: number,
    nextItem: (index: number) => number,
    compareFn: (index: number) => boolean
  ) => {
    let i = index;
    while (compareFn(i)) {
      i = nextItem(i);
      if (!filteredData[i].disabled) return i;
    }
    return index;
  };

  createEffect(on(inputValue, () => setHovered(-1)));

  const selectedItemIndex = createMemo(() =>
    _value() ? filteredData().findIndex((el) => el.value === _value()) : 0
  );

  const shouldShowDropdown = createMemo(
    () =>
      !local.readOnly &&
      (filteredData().length > 0
        ? dropdownOpened()
        : dropdownOpened() && !!local.nothingFound)
  );

  const handlePrevious = () => {
    setHovered((current) => {
      const nextIndex = getNextIndex(
        current,
        (index) => index - 1,
        (index) => index > 0
      );

      setTargetRef(itemsRefs[filteredData()[nextIndex]?.value]);
      shouldShowDropdown() &&
        scrollIntoView({ alignment: isColumn() ? "start" : "end" });
      return nextIndex;
    });
  };

  const handleNext = () => {
    setHovered((current) => {
      const nextIndex = getNextIndex(
        current,
        (index) => index + 1,
        (index) => index < filteredData().length - 1
      );

      setTargetRef(itemsRefs[filteredData()[nextIndex]?.value]);
      shouldShowDropdown() &&
        scrollIntoView({ alignment: isColumn() ? "end" : "start" });
      return nextIndex;
    });
  };

  const scrollSelectedItemIntoView = () =>
    window.setTimeout(() => {
      setTargetRef(itemsRefs[filteredData()[selectedItemIndex()]?.value]);
      scrollIntoView({ alignment: isColumn() ? "end" : "start" });
    }, 0);

  createEffect(
    on(shouldShowDropdown, (show) => show && scrollSelectedItemIntoView(), {
      defer: true,
    })
  );

  const handleInputKeydown = (event: KeyboardEvent) => {
    typeof local.onKeyDown === "function" && local.onKeyDown(event as any);
    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();

        if (!dropdownOpened()) {
          setHovered(selectedItemIndex());
          setDropdownOpened(true);
          scrollSelectedItemIntoView();
        } else {
          isColumn() ? handlePrevious() : handleNext();
        }

        break;
      }

      case "ArrowDown": {
        event.preventDefault();

        if (!dropdownOpened()) {
          setHovered(selectedItemIndex());
          setDropdownOpened(true);
          scrollSelectedItemIntoView();
        } else {
          isColumn() ? handleNext() : handlePrevious();
        }

        break;
      }

      case "Home": {
        if (!local.searchable) {
          event.preventDefault();

          if (!dropdownOpened()) {
            setDropdownOpened(true);
          }

          const firstItemIndex = filteredData().findIndex(
            (item) => !item.disabled
          );
          setHovered(firstItemIndex);
          shouldShowDropdown() &&
            scrollIntoView({ alignment: isColumn() ? "end" : "start" });
        }
        break;
      }

      case "End": {
        if (!local.searchable) {
          event.preventDefault();

          if (!dropdownOpened()) {
            setDropdownOpened(true);
          }

          const lastItemIndex = filteredData()
            .map((item) => !!item.disabled)
            .lastIndexOf(false);
          setHovered(lastItemIndex);
          shouldShowDropdown() &&
            scrollIntoView({ alignment: isColumn() ? "end" : "start" });
        }
        break;
      }

      case "Escape": {
        event.preventDefault();
        setDropdownOpened(false);
        setHovered(-1);
        break;
      }

      case " ": {
        if (!local.searchable) {
          event.preventDefault();
          if (filteredData()[hovered()] && dropdownOpened()) {
            handleItemSelect(filteredData()[hovered()]);
          } else {
            setDropdownOpened(true);
            setHovered(selectedItemIndex);
            scrollSelectedItemIntoView();
          }
        }

        break;
      }

      case "Enter": {
        if (!local.searchable) {
          event.preventDefault();
        }

        if (filteredData()[hovered()] && dropdownOpened()) {
          event.preventDefault();
          handleItemSelect(filteredData()[hovered()]);
        }
      }
    }
  };

  const handleInputBlur = (event: FocusEvent) => {
    typeof local.onBlur === "function" && local.onBlur(event as any);
    const selected = sortedData().find((item) => item.value === _value());
    if (local.selectOnBlur && filteredData()[hovered()] && dropdownOpened()) {
      handleItemSelect(filteredData()[hovered()]);
    }
    handleSearchChange(selected?.label || "");
    setDropdownOpened(false);
  };

  const handleInputFocus = (event: FocusEvent) => {
    typeof local.onFocus === "function" && local.onFocus(event as any);
    if (local.searchable) {
      setDropdownOpened(true);
    }
  };

  const handleInputChange = (event: any) => {
    if (!local.readOnly) {
      handleSearchChange(event.currentTarget.value);

      if (local.clearable && event.currentTarget.value === "") {
        handleChange(null);
      }

      setHovered(-1);
      setDropdownOpened(true);
    }
  };

  const handleInputClick = () => {
    if (!local.readOnly) {
      setDropdownOpened(!dropdownOpened());

      if (_value() && !dropdownOpened()) {
        setHovered(selectedItemIndex());
      }
    }
  };

  return (
    <Input.Wrapper {...local.wrapperProps} __staticSelector="Select">
      <SelectPopover
        opened={shouldShowDropdown()}
        transition={local.transition}
        transitionDuration={local.transitionDuration}
        shadow="sm"
        withinPortal={local.withinPortal}
        __staticSelector="Select"
        onDirectionChange={setDirection}
        switchDirectionOnFlip={local.switchDirectionOnFlip}
        zIndex={local.zIndex}
        dropdownPosition={local.dropdownPosition}
        positionDependencies={local.positionDependencies}
        classNames={local.classNames}
        styles={local.styles}
        unstyled={local.unstyled}
      >
        <SelectPopover.Target>
          <Box
            role="combobox"
            aria-haspopup="listbox"
            aria-owns={
              shouldShowDropdown() ? `${local.inputProps.id}-items` : null
            }
            aria-controls={local.inputProps.id}
            aria-expanded={shouldShowDropdown()}
            onMouseLeave={() => setHovered(-1)}
            tabIndex={-1}
          >
            <input
              type="hidden"
              name={local.name}
              value={_value() || ""}
              form={local.form}
              disabled={local.disabled}
            />

            <Input<"input">
              autocomplete="off"
              type="search"
              {...local.inputProps}
              {...others}
              ref={mergeRefs((r) => (inputRef = r), local.ref)}
              onKeyDown={handleInputKeydown}
              __staticSelector="Select"
              value={inputValue()}
              placeholder={local.placeholder}
              onChange={handleInputChange}
              aria-autocomplete="list"
              aria-controls={
                shouldShowDropdown() ? `${local.inputProps.id}-items` : null
              }
              aria-activedescendant={
                hovered() >= 0 ? `${local.inputProps.id}-${hovered()}` : null
              }
              onMouseDown={handleInputClick}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              readOnly={!local.searchable || local.readOnly}
              disabled={local.disabled}
              data-mantine-stop-propagation={shouldShowDropdown()}
              name={null}
              classNames={{
                ...local.classNames,
                input: cx(
                  { [classes.input]: !local.searchable },
                  (local.classNames as any)?.input
                ),
              }}
              {...getSelectRightSectionProps({
                theme,
                rightSection: local.rightSection,
                rightSectionWidth: local.rightSectionWidth,
                styles: local.styles,
                size: local.inputProps.size,
                shouldClear: local.clearable && !!selectedValue(),
                clearButtonLabel: local.clearButtonLabel,
                onClear: handleClear,
                error: local.wrapperProps.error,
                clearButtonTabIndex: local.clearButtonTabIndex,
                disabled: local.disabled,
                readOnly: local.readOnly,
              })}
            />
          </Box>
        </SelectPopover.Target>

        <SelectPopover.Dropdown
          component={local.dropdownComponent || SelectScrollArea}
          maxHeight={local.maxDropdownHeight}
          direction={direction()}
          id={local.inputProps.id}
          innerRef={setScrollableRef}
          __staticSelector="Select"
          classNames={local.classNames}
          styles={local.styles}
        >
          <SelectItems
            data={filteredData()}
            hovered={hovered()}
            classNames={local.classNames}
            styles={local.styles}
            isItemSelected={(val) => val === _value()}
            uuid={local.inputProps.id}
            __staticSelector="Select"
            onItemHover={setHovered}
            onItemSelect={handleItemSelect}
            itemsRefs={itemsRefs}
            itemComponent={local.itemComponent}
            size={local.inputProps.size}
            nothingFound={local.nothingFound}
            creatable={isCreatable() && !!createLabel}
            createLabel={createLabel}
            aria-label={local.wrapperProps.label}
            unstyled={local.unstyled}
          />
        </SelectPopover.Dropdown>
      </SelectPopover>
    </Input.Wrapper>
  );
};

Select.displayName = "@mantine/core/Select";
