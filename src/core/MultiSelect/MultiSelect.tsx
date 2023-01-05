import { useUncontrolled, useScrollIntoView, useId } from "hooks";
import {
  DefaultProps,
  Selectors,
  getDefaultZIndex,
  useComponentDefaultProps,
  ComponentWithRef,
} from "styles";
import { groupOptions } from "utils";
import { Box, extractSystemStyles } from "../Box";
import { Input } from "../Input";
import {
  DefaultValue,
  DefaultValueStylesNames,
} from "./DefaultValue/DefaultValue";
import { DefaultItem } from "../Select/DefaultItem/DefaultItem";
import { filterData } from "./filter-data/filter-data";
import { getSelectRightSectionProps } from "../Select/SelectRightSection/get-select-right-section-props";
import { SelectScrollArea } from "../Select/SelectScrollArea/SelectScrollArea";
import { SelectPopover } from "../Select/SelectPopover/SelectPopover";
import {
  SelectItem,
  BaseSelectProps,
  BaseSelectStylesNames,
} from "../Select/types";
import { SelectItems } from "../Select/SelectItems/SelectItems";
import useStyles from "./MultiSelect.styles";
import { SelectSharedProps } from "../Select/Select";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  JSXElement,
  on,
  splitProps,
} from "solid-js";
import { mergeRefs } from "@solid-primitives/refs";

export type MultiSelectStylesNames =
  | DefaultValueStylesNames
  | Exclude<
      Selectors<typeof useStyles>,
      "searchInputEmpty" | "searchInputInputHidden" | "searchInputPointer"
    >
  | Exclude<BaseSelectStylesNames, "selected">;

export interface MultiSelectProps
  extends DefaultProps<MultiSelectStylesNames>,
    BaseSelectProps,
    Omit<SelectSharedProps<SelectItem, string[]>, "filter"> {
  /** Component used to render values */
  valueComponent?: Component<any>;

  /** Maximum dropdown height in px */
  maxDropdownHeight?: number;

  /** Enable items searching */
  searchable?: boolean;

  /** Function based on which items in dropdown are filtered */
  filter?(value: string, selected: boolean, item: SelectItem): boolean;

  /** Clear search value when item is selected */
  clearSearchOnChange?: boolean;

  /** Allow to clear item */
  clearable?: boolean;

  /** aria-label for clear button */
  clearButtonLabel?: string;

  /** Clear search field value on blur */
  clearSearchOnBlur?: boolean;

  /** Called each time search query changes */
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

  /** Change dropdown component, can be used to add custom scrollbars */
  dropdownComponent?: any;

  /** Limit amount of items selected */
  maxSelectedValues?: number;

  /** Select highlighted item on blur */
  selectOnBlur?: boolean;

  /** Set the clear button tab index to disabled or default after input field */
  clearButtonTabIndex?: -1 | 0;
}

export function defaultFilter(
  value: string,
  selected: boolean,
  item: SelectItem
) {
  if (selected) {
    return false;
  }
  return item.label.toLowerCase().trim().includes(value.toLowerCase().trim());
}

export function defaultShouldCreate(query: string, data: SelectItem[]) {
  return (
    !!query &&
    !data.some((item) => item.value.toLowerCase() === query.toLowerCase())
  );
}

function filterValue(value: string[], data: (string | SelectItem)[]): string[] {
  if (!Array.isArray(value)) {
    return undefined;
  }

  if (data.length === 0) {
    return [];
  }

  const flatData: string[] =
    typeof data[0] === "object"
      ? data.map((item) => (item as any).value)
      : data;
  return value.filter((val) => flatData.includes(val));
}

const defaultProps: Partial<MultiSelectProps> = {
  size: "sm",
  valueComponent: DefaultValue,
  itemComponent: DefaultItem,
  transition: "pop-top-left",
  transitionDuration: 0,
  maxDropdownHeight: 220,
  shadow: "sm",
  searchable: false,
  filter: defaultFilter,
  limit: Infinity,
  clearSearchOnChange: true,
  clearable: false,
  clearSearchOnBlur: false,
  disabled: false,
  initiallyOpened: false,
  creatable: false,
  shouldCreate: defaultShouldCreate,
  switchDirectionOnFlip: false,
  zIndex: getDefaultZIndex("popover"),
  selectOnBlur: false,
  clearButtonTabIndex: 0,
  positionDependencies: [],
};

export const MultiSelect: ComponentWithRef<
  MultiSelectProps,
  HTMLInputElement
> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("MultiSelect", defaultProps, props),
    [
      "ref",
      "className",
      "style",
      "required",
      "label",
      "description",
      "size",
      "error",
      "classNames",
      "styles",
      "wrapperProps",
      "value",
      "defaultValue",
      "data",
      "onChange",
      "valueComponent",
      "itemComponent",
      "id",
      "transition",
      "transitionDuration",
      "transitionTimingFunction",
      "maxDropdownHeight",
      "shadow",
      "nothingFound",
      "onFocus",
      "onBlur",
      "searchable",
      "placeholder",
      "filter",
      "limit",
      "clearSearchOnChange",
      "clearable",
      "clearSearchOnBlur",
      "clearButtonLabel",
      "variant",
      "onSearchChange",
      "searchValue",
      "disabled",
      "initiallyOpened",
      "radius",
      "icon",
      "rightSection",
      "rightSectionWidth",
      "creatable",
      "getCreateLabel",
      "shouldCreate",
      "onCreate",
      "sx",
      "dropdownComponent",
      "onDropdownClose",
      "onDropdownOpen",
      "maxSelectedValues",
      "withinPortal",
      "switchDirectionOnFlip",
      "zIndex",
      "selectOnBlur",
      "name",
      "dropdownPosition",
      "errorProps",
      "labelProps",
      "descriptionProps",
      "clearButtonTabIndex",
      "form",
      "positionDependencies",
      "onKeyDown",
      "unstyled",
      "inputContainer",
      "inputWrapperOrder",
      "readOnly",
      "withAsterisk",
    ]
  );

  const { classes, cx, theme } = useStyles(
    { size: local.size, invalid: !!local.error },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "MultiSelect",
    }
  );

  const { systemStyles, rest } = extractSystemStyles(others);
  let inputRef: HTMLInputElement;
  let wrapperRef: HTMLDivElement;
  const itemsRefs: Record<string, HTMLDivElement> = {};

  const uuid = useId(local.id);

  const [dropdownOpened, setDropdownOpened] = createSignal(
    local.initiallyOpened
  );
  const [hovered, setHovered] = createSignal(-1);
  const [direction, setDirection] =
    createSignal<JSX.CSSProperties["flex-direction"]>("column");

  const [_searchValue, handleSearchChange] = useUncontrolled({
    value: () => local.searchValue,
    defaultValue: "",
    finalValue: undefined,
    onChange: local.onSearchChange,
  });

  const [IMEOpen, setIMEOpen] = createSignal(false);

  const { scrollIntoView, scrollableRef, setTargetRef } = useScrollIntoView({
    duration: 0,
    offset: 5,
    cancelable: false,
    isList: true,
  });

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

  const [_value, setValue] = useUncontrolled({
    value: () => filterValue(local.value, local.data),
    defaultValue: filterValue(local.defaultValue, local.data),
    finalValue: [],
    onChange: local.onChange,
  });

  let valuesOverflow =
    !!local.maxSelectedValues && local.maxSelectedValues < _value().length;

  const handleValueRemove = (_val: string) => {
    if (!local.readOnly) {
      const newValue = _value().filter((val) => val !== _val);
      setValue(newValue);

      if (
        !!local.maxSelectedValues &&
        newValue.length < local.maxSelectedValues
      ) {
        valuesOverflow = false;
      }
    }
  };

  const handleInputChange = (event) => {
    handleSearchChange(event.currentTarget.value);
    !local.disabled &&
      !valuesOverflow &&
      local.searchable &&
      setDropdownOpened(true);
  };

  const handleInputFocus = (event: FocusEvent) => {
    typeof local.onFocus === "function" && local.onFocus(event as any);
    !local.disabled &&
      !valuesOverflow &&
      local.searchable &&
      setDropdownOpened(true);
  };

  const filteredData = createMemo(() => {
    const filtered = filterData({
      data: sortedData(),
      searchable: local.searchable,
      searchValue: _searchValue(),
      limit: local.limit,
      filter: local.filter,
      value: _value(),
    });

    if (isCreatable() && local.shouldCreate(_searchValue(), sortedData())) {
      createLabel = local.getCreateLabel(_searchValue());
      filtered.push({
        label: _searchValue,
        value: _searchValue,
        creatable: true,
      });
    }

    return filtered;
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

  createEffect(on(_searchValue, () => setHovered(-1), { defer: true }));

  createEffect(
    on(
      _value,
      (_value) => {
        if (!local.disabled && _value.length > local.data.length) {
          setDropdownOpened(false);
        }

        if (
          !!local.maxSelectedValues &&
          _value.length < local.maxSelectedValues
        ) {
          valuesOverflow = false;
        }

        if (
          !!local.maxSelectedValues &&
          _value.length >= local.maxSelectedValues
        ) {
          valuesOverflow = true;
          setDropdownOpened(false);
        }
      },
      { defer: true }
    )
  );

  const handleItemSelect = (item: SelectItem) => {
    if (!local.readOnly) {
      local.clearSearchOnChange && handleSearchChange("");

      if (_value().includes(item.value)) {
        handleValueRemove(item.value);
      } else {
        if (item.creatable && typeof local.onCreate === "function") {
          const createdItem = local.onCreate(item.value);
          if (typeof createdItem !== "undefined" && createdItem !== null) {
            if (typeof createdItem === "string") {
              setValue([..._value(), createdItem]);
            } else {
              setValue([..._value(), createdItem.value]);
            }
          }
        } else {
          setValue([..._value(), item.value]);
        }

        if (_value().length === local.maxSelectedValues - 1) {
          valuesOverflow = true;
          setDropdownOpened(false);
        }
        if (hovered() === filteredData().length - 1) {
          setHovered(filteredData().length - 2);
        }
        if (filteredData().length === 1) {
          setDropdownOpened(false);
        }
      }
    }
  };

  const handleInputBlur = (event: FocusEvent) => {
    typeof local.onBlur === "function" && local.onBlur(event as any);
    if (local.selectOnBlur && filteredData()[hovered()] && dropdownOpened()) {
      handleItemSelect(filteredData()[hovered()]);
    }
    local.clearSearchOnBlur && handleSearchChange("");
    setDropdownOpened(false);
  };

  const handleInputKeydown = (event: KeyboardEvent) => {
    if (IMEOpen()) {
      return;
    }

    (local.onKeyDown as any)?.(event);

    if (local.readOnly) {
      return;
    }

    if (
      event.key !== "Backspace" &&
      !!local.maxSelectedValues &&
      valuesOverflow
    ) {
      return;
    }

    const isColumn = direction() === "column";

    const handleNext = () => {
      setHovered((current) => {
        const nextIndex = getNextIndex(
          current,
          (index) => index + 1,
          (index) => index < filteredData().length - 1
        );

        if (dropdownOpened()) {
          setTargetRef(itemsRefs.current[filteredData()[nextIndex]?.value]);

          scrollIntoView({
            alignment: isColumn ? "end" : "start",
          });
        }

        return nextIndex;
      });
    };

    const handlePrevious = () => {
      setHovered((current) => {
        const nextIndex = getNextIndex(
          current,
          (index) => index - 1,
          (index) => index > 0
        );

        if (dropdownOpened()) {
          setTargetRef(itemsRefs.current[filteredData()[nextIndex]?.value]);

          scrollIntoView({
            alignment: isColumn ? "start" : "end",
          });
        }

        return nextIndex;
      });
    };

    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        setDropdownOpened(true);

        isColumn ? handlePrevious() : handleNext();

        break;
      }

      case "ArrowDown": {
        event.preventDefault();
        setDropdownOpened(true);

        isColumn ? handleNext() : handlePrevious();

        break;
      }

      case "Enter": {
        event.preventDefault();

        if (filteredData()[hovered()] && dropdownOpened()) {
          handleItemSelect(filteredData()[hovered()]);
        } else {
          setDropdownOpened(true);
        }

        break;
      }

      case " ": {
        if (!local.searchable) {
          event.preventDefault();
          if (filteredData()[hovered()] && dropdownOpened()) {
            handleItemSelect(filteredData()[hovered()]);
          } else {
            setDropdownOpened(true);
          }
        }

        break;
      }

      case "Backspace": {
        if (_value().length > 0 && _searchValue().length === 0) {
          setValue(_value().slice(0, -1));
          setDropdownOpened(true);
          if (local.maxSelectedValues) {
            valuesOverflow = false;
          }
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
          scrollIntoView({
            alignment: isColumn ? "end" : "start",
          });
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
          scrollIntoView({
            alignment: isColumn ? "end" : "start",
          });
        }
        break;
      }

      case "Escape": {
        setDropdownOpened(false);
      }
    }
  };

  const selectedItems = createMemo(() =>
    _value()
      .map((val) => {
        let selectedItem = sortedData().find(
          (item) => item.value === val && !item.disabled
        );
        if (!selectedItem && isCreatable()) {
          selectedItem = {
            value: val,
            label: val,
          };
        }
        return selectedItem;
      })
      .filter((val) => !!val)
  );

  const handleClear = () => {
    handleSearchChange("");
    setValue([]);
    inputRef?.focus();
    if (local.maxSelectedValues) {
      valuesOverflow = false;
    }
  };

  const shouldRenderDropdown = createMemo(
    () =>
      !local.readOnly &&
      (filteredData().length > 0
        ? dropdownOpened()
        : dropdownOpened() && !!local.nothingFound)
  );

  createEffect(
    on(
      shouldRenderDropdown,
      (drop) => {
        const handler = drop ? local.onDropdownOpen : local.onDropdownClose;
        typeof handler === "function" && handler();
      },
      { defer: true }
    )
  );

  return (
    <Input.Wrapper
      required={local.required}
      id={uuid}
      label={local.label}
      error={local.error}
      description={local.description}
      size={local.size}
      className={local.className}
      style={local.style}
      classNames={local.classNames}
      styles={local.styles}
      __staticSelector="MultiSelect"
      sx={local.sx}
      errorProps={local.errorProps}
      descriptionProps={local.descriptionProps}
      labelProps={local.labelProps}
      inputContainer={local.inputContainer}
      inputWrapperOrder={local.inputWrapperOrder}
      unstyled={local.unstyled}
      withAsterisk={local.withAsterisk}
      {...systemStyles}
      {...local.wrapperProps}
    >
      <SelectPopover
        opened={shouldRenderDropdown()}
        transition={local.transition}
        transitionDuration={local.transitionDuration}
        shadow="sm"
        withinPortal={local.withinPortal}
        __staticSelector="MultiSelect"
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
            className={classes.wrapper}
            role="combobox"
            aria-haspopup="listbox"
            aria-owns={
              dropdownOpened() && shouldRenderDropdown()
                ? `${uuid}-items`
                : null
            }
            aria-controls={uuid}
            aria-expanded={dropdownOpened()}
            onMouseLeave={() => setHovered(-1)}
            tabIndex={-1}
            ref={wrapperRef}
          >
            <input
              type="hidden"
              name={local.name}
              value={_value().join(",")}
              form={local.form}
              disabled={local.disabled}
            />

            <Input<"div">
              __staticSelector="MultiSelect"
              style={{ overflow: "hidden" }}
              component="div"
              multiline
              size={local.size}
              variant={local.variant}
              disabled={local.disabled}
              invalid={!!local.error}
              required={local.required}
              radius={local.radius}
              icon={local.icon}
              unstyled={local.unstyled}
              onMouseDown={(event) => {
                event.preventDefault();
                !local.disabled &&
                  !valuesOverflow &&
                  setDropdownOpened(!dropdownOpened());
                inputRef?.focus();
              }}
              classNames={{
                ...local.classNames,
                input: cx(
                  { [classes.input]: !local.searchable },
                  local.classNames?.input
                ),
              }}
              {...getSelectRightSectionProps({
                theme,
                rightSection: local.rightSection,
                rightSectionWidth: local.rightSectionWidth,
                styles: local.styles,
                size: local.size,
                shouldClear: local.clearable && _value().length > 0,
                clearButtonLabel: local.clearButtonLabel,
                onClear: handleClear,
                error: local.error,
                disabled: local.disabled,
                clearButtonTabIndex: local.clearButtonTabIndex,
                readOnly: local.readOnly,
              })}
            >
              <div class={classes.values}>
                <For each={selectedItems()}>
                  {(item) => (
                    <local.valueComponent
                      {...item}
                      variant={local.variant}
                      disabled={local.disabled}
                      className={classes.value}
                      readOnly={local.readOnly}
                      onRemove={(event: MouseEvent) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleValueRemove(item.value);
                      }}
                      key={item.value}
                      size={local.size}
                      styles={local.styles}
                      classNames={local.classNames}
                      radius={local.radius}
                    />
                  )}
                </For>

                <input
                  ref={mergeRefs((e) => (inputRef = e), local.ref)}
                  type="search"
                  id={uuid}
                  class={cx(classes.searchInput, {
                    [classes.searchInputPointer]: !local.searchable,
                    [classes.searchInputInputHidden]:
                      (!dropdownOpened() && _value().length > 0) ||
                      (!local.searchable && _value().length > 0),
                    [classes.searchInputEmpty]: _value().length === 0,
                  })}
                  onKeyDown={handleInputKeydown}
                  value={_searchValue()}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  readOnly={
                    !local.searchable || valuesOverflow || local.readOnly
                  }
                  placeholder={
                    _value().length === 0 ? local.placeholder : undefined
                  }
                  disabled={local.disabled}
                  data-mantine-stop-propagation={dropdownOpened()}
                  autocomplete="off"
                  onCompositionStart={() => setIMEOpen(true)}
                  onCompositionEnd={() => setIMEOpen(false)}
                  {...rest}
                />
              </div>
            </Input>
          </Box>
        </SelectPopover.Target>

        <SelectPopover.Dropdown
          component={local.dropdownComponent || SelectScrollArea}
          maxHeight={local.maxDropdownHeight}
          direction={direction()}
          id={uuid}
          innerRef={scrollableRef}
          __staticSelector="MultiSelect"
          classNames={local.classNames}
          styles={local.styles}
        >
          <SelectItems
            data={filteredData()}
            hovered={hovered()}
            classNames={local.classNames}
            styles={local.styles}
            uuid={uuid}
            __staticSelector="MultiSelect"
            onItemHover={setHovered}
            onItemSelect={handleItemSelect}
            itemsRefs={itemsRefs}
            itemComponent={local.itemComponent}
            size={local.size}
            nothingFound={local.nothingFound}
            creatable={local.creatable && !!createLabel}
            createLabel={createLabel}
            unstyled={local.unstyled}
          />
        </SelectPopover.Dropdown>
      </SelectPopover>
    </Input.Wrapper>
  );
};

MultiSelect.displayName = "@mantine/core/MultiSelect";
