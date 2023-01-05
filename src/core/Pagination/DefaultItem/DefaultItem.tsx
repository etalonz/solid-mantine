import { ComponentProps, Show, splitProps } from "solid-js";
import { useMantineTheme } from "styles";
import * as _icons from "../icons";

export interface PaginationItemProps
  extends Omit<ComponentProps<"button">, "ref"> {
  page: number | "dots" | "prev" | "next" | "first" | "last";
  active?: boolean;
  onClick?: () => void;
}

const icons = {
  dots: _icons.DotsIcon,
  next: _icons.NextIcon,
  prev: _icons.PrevIcon,
  first: _icons.FirstIcon,
  last: _icons.LastIcon,
};

const rtlIcons = {
  dots: _icons.DotsIcon,
  prev: _icons.NextIcon,
  next: _icons.PrevIcon,
  last: _icons.FirstIcon,
  first: _icons.LastIcon,
};

export function DefaultItem(props: PaginationItemProps) {
  const [local, others] = splitProps(props, ["page", "active", "onClick"]);
  const theme = useMantineTheme();
  const Item = (theme.dir === "rtl" ? rtlIcons : icons)[local.page];

  return (
    <button type="button" onClick={local.onClick} {...others}>
      <Show when={!!Item} fallback={() => local.page}>
        <Item />
      </Show>
    </button>
  );
}

DefaultItem.displayName = "@mantine/core/Pagination/DefaultItem";
