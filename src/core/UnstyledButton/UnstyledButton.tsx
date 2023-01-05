import { ParentProps, splitProps } from "solid-js";
import {
  DefaultProps,
  useComponentDefaultProps,
  ComponentWithRef,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { Box } from "../Box";
import useStyles from "./UnstyledButton.styles";

export interface UnstyledButtonProps extends DefaultProps, ParentProps {}

export const _UnstyledButton: ComponentWithRef<
  UnstyledButtonProps & { component?: any },
  HTMLDivElement
> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("UnstyledButton", {}, props),
    ["className", "component", "unstyled"]
  );
  const { classes, cx } = useStyles(null, {
    name: "UnstyledButton",
    unstyled: local.unstyled,
  });
  return (
    <Box
      component={local.component || "button"}
      className={cx(classes.root, local.className)}
      type={
        !local.component || local.component === "button" ? "button" : undefined
      }
      {...others}
    />
  );
};

_UnstyledButton.displayName = "@mantine/core/UnstyledButton";

export const UnstyledButton = createPolymorphicComponent<
  "button",
  UnstyledButtonProps
>(_UnstyledButton);
