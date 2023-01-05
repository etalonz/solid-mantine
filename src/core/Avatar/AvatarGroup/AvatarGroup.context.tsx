import { createContext, FlowProps, useContext } from "solid-js";
import { MantineNumberSize } from "styles";

interface ContextValue {
  spacing: MantineNumberSize;
}

const AvatarGroupContext = createContext<ContextValue>(null);

interface AvatarGroupProviderProps extends FlowProps<ContextValue> {}

export function AvatarGroupProvider({
  spacing,
  children,
}: AvatarGroupProviderProps) {
  return (
    <AvatarGroupContext.Provider value={{ spacing }}>
      {children}
    </AvatarGroupContext.Provider>
  );
}

export function useAvatarGroupContext() {
  const ctx = useContext(AvatarGroupContext);

  if (ctx) {
    return { ...ctx, withinGroup: true };
  }

  return { spacing: null, withinGroup: false };
}
