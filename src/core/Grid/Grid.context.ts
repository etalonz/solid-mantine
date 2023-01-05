import type { MantineNumberSize } from "styles";
import { createContext, useContext } from "solid-js";

interface GridContextValue {
  gutter: MantineNumberSize;
  grow: boolean;
  columns: number;
}

const GridContext = createContext<GridContextValue>(null);

export const GridProvider = GridContext.Provider;
export const useGridContext = () => useContext(GridContext);
