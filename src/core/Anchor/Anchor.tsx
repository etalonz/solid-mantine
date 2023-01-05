import { createMemo, ParentProps, splitProps } from "solid-js";
import { useComponentDefaultProps, ComponentWithRef } from "styles";
import { createPolymorphicComponent } from "utils";
import { Text, TextProps } from "../Text/Text";
import useStyles from "./Anchor.styles";

export interface AnchorProps extends TextProps, ParentProps {}

const defaultProps: Partial<AnchorProps> = {};

export const _Anchor: ComponentWithRef<
  AnchorProps & { component: any },
  HTMLAnchorElement
> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps(
      "Anchor",
      defaultProps as AnchorProps & { component: any },
      props
    ),
    ["component", "className", "unstyled"]
  );
  const { classes, cx } = useStyles(null, {
    name: "Anchor",
    unstyled: local.unstyled,
  });
  const buttonProps = createMemo(() =>
    local.component === "button" ? { type: "button" } : null
  );

  return (
    <Text
      component={local.component || "a"}
      variant="link"
      className={cx(classes.root, local.className)}
      {...buttonProps()}
      {...others}
    />
  );
};

_Anchor.displayName = "@mantine/core/Anchor";

export const Anchor = createPolymorphicComponent<"a", AnchorProps>(_Anchor);
