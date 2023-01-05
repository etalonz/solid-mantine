import { ComponentProps, ParentProps, splitProps } from "solid-js";
import { DefaultProps, MantineSize, Selectors, Component } from "styles";
import { Box } from "../../Box";
import useStyles, { InputLabelStylesParams } from "./InputLabel.styles";

export type InputLabelStylesNames = Selectors<typeof useStyles>;

export interface InputLabelProps
  extends DefaultProps<InputLabelStylesNames, InputLabelStylesParams>,
    ComponentProps<"label">,
    ParentProps {
  /** Label root element */
  labelElement?: "label" | "div";

  /** Determines whether required asterisk should be displayed */
  required?: boolean;

  /** Predefined label size */
  size?: MantineSize;

  __staticSelector?: string;
}

export const InputLabel: Component<InputLabelProps> = (props) => {
  const [local, others] = splitProps(props, [
    "labelElement",
    "children",
    "required",
    "size",
    "classNames",
    "styles",
    "unstyled",
    "className",
    "for",
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
    <Box<"label">
      component={(local.labelElement || "label") as "label"}
      className={cx(classes.label, local.className)}
      for={
        !local.labelElement || local.labelElement === "label"
          ? local.for
          : undefined
      }
      {...others}
    >
      {local.children}
      {local.required && (
        <span class={classes.required} aria-hidden>
          {" *"}
        </span>
      )}
    </Box>
  );
};

InputLabel.displayName = "@mantine/core/InputLabel";
