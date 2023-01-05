import { createContext, JSXElement, useContext } from "solid-js";
import { MantineNumberSize } from "styles";

interface ListContextValue {
  spacing?: MantineNumberSize;
  center?: boolean;
  icon?: JSXElement;
  listStyleType?: string;
  withPadding?: boolean;
  size?: MantineNumberSize;
}

export const ListContext = createContext<ListContextValue>(null);

export function useListContext(): ListContextValue {
  return useContext(ListContext) || {};
}
