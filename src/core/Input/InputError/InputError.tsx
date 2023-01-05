import { ParentProps, ComponentProps, splitProps } from "solid-js";
import { DefaultProps, MantineSize, Selectors, Component } from "styles";
import { Text } from "../../Text";
import useStyles, { InputErrorStylesParams } from "./InputError.styles";

export type InputErrorStylesNames = Selectors<typeof useStyles>;

export interface InputErrorProps
  extends DefaultProps<InputErrorStylesNames, InputErrorStylesParams>,
    ComponentProps<"div">,
    ParentProps {
  /** Predefined size */
  size?: MantineSize;

  __staticSelector?: string;
}

export const InputError: Component<InputErrorProps> = (props) => {
  const [local, others] = splitProps(props, [
    "children",
    "className",
    "classNames",
    "styles",
    "unstyled",
    "size",
    "__staticSelector",
  ]);

  const { classes, cx } = useStyles(
    { size: local.size || "sm" },
    {
      name: ["InputWrapper", local.__staticSelector],
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );
  return (
    <Text
      className={cx(classes.error, local.className)}
      role="alert"
      {...others}
    >
      {local.children}
    </Text>
  );
};

InputError.displayName = "@mantine/core/InputError";
