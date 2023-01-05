import { ComponentWithRef, DefaultProps, MantineSize, Selectors } from "styles";
import { Text } from "../../Text";
import useStyles, {
  InputDescriptionStylesParams,
} from "./InputDescription.styles";
import { ComponentProps, ParentProps, splitProps } from "solid-js";

export type InputDescriptionStylesNames = Selectors<typeof useStyles>;

export interface InputDescriptionProps
  extends DefaultProps<
      InputDescriptionStylesNames,
      InputDescriptionStylesParams
    >,
    ComponentProps<"div">,
    ParentProps {
  /** Predefined size */
  size?: MantineSize;

  __staticSelector?: string;
}

export const InputDescription: ComponentWithRef<
  InputDescriptionProps,
  HTMLDivElement
> = (props) => {
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
      color="dimmed"
      className={cx(classes.description, local.className)}
      unstyled={local.unstyled}
      {...others}
    >
      {local.children}
    </Text>
  );
};

InputDescription.displayName = "@mantine/core/InputDescription";
