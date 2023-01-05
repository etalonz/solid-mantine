/* eslint-disable react/no-unused-prop-types */
import {
  ComponentWithRef,
  DefaultProps,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../../Box";
import useStyles, { ButtonGroupStylesParams } from "./ButtonGroup.styles";
import { ComponentProps, ParentProps, splitProps } from "solid-js";

export interface ButtonGroupProps
  extends DefaultProps<never, ButtonGroupStylesParams>,
    ComponentProps<"div">,
    ParentProps {
  /** Switch between vertical and horizontal orientation */
  orientation?: "vertical" | "horizontal";

  /** Child <Button /> border width in px */
  buttonBorderWidth?: number;
}

const defaultProps: Partial<ButtonGroupProps> = {
  orientation: "horizontal",
  buttonBorderWidth: 1,
};

export const ButtonGroup: ComponentWithRef<ButtonGroupProps, HTMLDivElement> = (
  props
) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("ButtonGroup", defaultProps, props),
    ["className", "orientation", "buttonBorderWidth", "unstyled"]
  );
  const { classes, cx } = useStyles(
    {
      orientation: local.orientation,
      buttonBorderWidth: local.buttonBorderWidth,
    },
    { name: "ButtonGroup", unstyled: local.unstyled }
  );
  return <Box className={cx(classes.root, local.className)} {...others} />;
};

ButtonGroup.displayName = "@mantine/core/ButtonGroup";
