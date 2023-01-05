import { Component } from "styles";

export function createContextContainer<T>(
  Component: Component<T>,
  Provider: Component<any>,
  providerProps?: Record<string, any>
) {
  const Container = (props: T) => (
    <Provider {...providerProps}>
      <Component {...props} />
    </Provider>
  );

  Container.displayName = Component.displayName;
  return Container;
}
