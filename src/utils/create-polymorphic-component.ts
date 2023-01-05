import { Component, ComponentProps, JSX } from "solid-js";

/** All HTML and SVG elements. */
export type DOMElements = keyof JSX.IntrinsicElements;

/** Any HTML element or SolidJS component. */
export type ElementType<Props = any> = DOMElements | Component<Props>;

/**
 * Allows for extending a set of props (`Source`) by an overriding set of props (`Override`),
 * ensuring that any duplicates are overridden by the overriding set of props.
 */
export type OverrideProps<Source = {}, Override = {}> = Omit<
  Source,
  keyof Override
> &
  Override;

/** The `as` prop type. */
export type As<Props = any> = ElementType<Props>;

type ComponentProp<C> = {
  component?: C;
};

/** Props object that includes the `as` prop. */
export type PolymorphicProps<Type extends As = As, Props = {}> = OverrideProps<
  ComponentProps<Type>,
  Props & ComponentProp<Type> & { children?: JSX.Element }
>;

/** A component with the `as` prop. */
export type PolymorphicComponent<DefaultType extends As, Props = {}> = {
  <Type extends As>(
    props: PolymorphicProps<Type, Props> & ComponentProp<Type>
  ): JSX.Element;
  (props: PolymorphicProps<DefaultType, Props>): JSX.Element;
};

export function createPolymorphicComponent<
  ComponentDefaultType extends As,
  Props,
  StaticComponents = Record<string, never>
>(component: any) {
  type ComponentProps_<C extends As> = PolymorphicProps<C, Props>;

  type _PolymorphicComponent = <C extends As = ComponentDefaultType>(
    props: ComponentProps_<C>
  ) => JSX.Element;

  type ComponentProperties = Omit<Component<ComponentProps_<any>>, never>;

  type PolymorphicComponent = _PolymorphicComponent &
    ComponentProperties &
    StaticComponents;

  return component as PolymorphicComponent;
}
