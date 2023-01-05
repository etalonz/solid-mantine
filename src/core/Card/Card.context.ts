import { createContext, useContext } from "solid-js";
const CardContext = createContext<{ padding: string | number }>({ padding: 0 });

export const CardProvider = CardContext.Provider;
export const useCardPadding = () => useContext(CardContext).padding;
