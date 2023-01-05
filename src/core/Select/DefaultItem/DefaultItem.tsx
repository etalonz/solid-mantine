import { ComponentProps, JSXElement, splitProps } from "solid-js";

export interface SelectItemProps extends Omit<ComponentProps<"div">, "value"> {
  label: JSXElement;
  value?: string;
}

export const DefaultItem = (props: SelectItemProps) => {
  const [local, others] = splitProps(props, ["label", "value"]);
  return <div {...others}>{local.label || local.value}</div>;
};

DefaultItem.displayName = "@mantine/core/DefaultItem";
