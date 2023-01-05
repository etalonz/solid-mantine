import {
  createMemo,
  createSignal,
  JSXElement,
  createContext,
  Setter,
  Accessor,
} from "solid-js";
//import { getDelay } from "./hooks/useHover";
//import type { FloatingContext } from "./types";

type Delay = number | Partial<{ open: number; close: number }>;

interface GroupState {
  delay: Delay;
  initialDelay: Delay;
  currentId: any;
}

/*interface GroupContext extends GroupState {
  setCurrentId: React.Dispatch<React.SetStateAction<any>>;
  setState: React.Dispatch<React.SetStateAction<GroupState>>;
}*/

const FloatingDelayGroupContext = createContext<
  Accessor<
    GroupState & {
      setCurrentId: (currentId: any) => void;
      setState: Setter<GroupState>;
    }
  >
>(() => ({
  delay: 1000,
  initialDelay: 1000,
  currentId: null,
  setCurrentId: () => {},
  setState: () => undefined,
}));

//export const useDelayGroupContext = (): GroupContext =>
// React.useContext(FloatingDelayGroupContext);

/**
 * Provides context for a group of floating elements that should share a
 * `delay`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export const FloatingDelayGroup = (p: {
  children?: JSXElement;
  delay: Delay;
}): JSXElement => {
  const [state, setState] = createSignal<GroupState>({
    delay: p.delay,
    initialDelay: p.delay,
    currentId: null,
  });

  const setCurrentId = (currentId: any) => {
    setState((state) => ({ ...state, currentId }));
  };

  return (
    <FloatingDelayGroupContext.Provider
      value={createMemo(() => ({ ...state(), setState, setCurrentId }))}
    >
      {p.children}
    </FloatingDelayGroupContext.Provider>
  );
};

/*
interface UseGroupOptions {
  id: any;
}

export const useDelayGroup = (
  { open, onOpenChange }: FloatingContext,
  { id }: UseGroupOptions
) => {
  const { currentId, initialDelay, setState } = useDelayGroupContext();

  React.useEffect(() => {
    if (currentId) {
      setState((state) => ({
        ...state,
        delay: { open: 1, close: getDelay(initialDelay, "close") },
      }));

      if (currentId !== id) {
        onOpenChange(false);
      }
    }
  }, [id, onOpenChange, setState, currentId, initialDelay]);

  React.useEffect(() => {
    if (!open && currentId === id) {
      onOpenChange(false);
      setState((state) => ({ ...state, delay: initialDelay, currentId: null }));
    }
  }, [open, setState, currentId, id, onOpenChange, initialDelay]);
};
*/
