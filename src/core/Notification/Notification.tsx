import {
  DefaultProps,
  MantineColor,
  Selectors,
  MantineNumberSize,
  useComponentDefaultProps,
  Component,
} from "styles";
import { Text } from "../Text";
import { Loader } from "../Loader";
import { CloseButton } from "../CloseButton";
import { Box } from "../Box";
import useStyles, { NotificationStylesParams } from "./Notification.styles";
import { ComponentProps, JSXElement, splitProps } from "solid-js";

export type NotificationStylesNames = Exclude<
  Selectors<typeof useStyles>,
  "withIcon"
>;

export interface NotificationProps
  extends DefaultProps<NotificationStylesNames, NotificationStylesParams>,
    Omit<ComponentProps<"div">, "title"> {
  /** Called when close button is clicked */
  onClose?(): void;

  /** Notification line or icon color */
  color?: MantineColor;

  /** Radius from theme.radius, or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Notification icon, replaces color line */
  icon?: JSXElement;

  /** Notification title, displayed before body */
  title?: JSXElement;

  /** Notification body, place main text here */
  children?: JSXElement;

  /** Replaces colored line or icon with Loader component */
  loading?: boolean;

  /** Removes close button */
  disallowClose?: boolean;

  /** Props spread to close button */
  closeButtonProps?: Record<string, any>;
}

export const Notification: Component<NotificationProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Notification", {}, props),
    [
      "className",
      "color",
      "radius",
      "loading",
      "disallowClose",
      "title",
      "icon",
      "children",
      "onClose",
      "closeButtonProps",
      "classNames",
      "styles",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    { color: local.color, radius: local.radius, withTitle: !!local.title },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Notification",
    }
  );
  const withIcon = local.icon || local.loading;

  return (
    <Box
      className={cx(
        classes.root,
        { [classes.withIcon]: withIcon },
        local.className
      )}
      role="alert"
      {...others}
    >
      {local.icon && !local.loading && (
        <div class={classes.icon}>{local.icon}</div>
      )}
      {local.loading && (
        <Loader size={28} color={local.color} className={classes.loader} />
      )}

      <div class={classes.body}>
        {local.title && (
          <Text className={classes.title} size="sm" weight={500}>
            {local.title}
          </Text>
        )}

        <Text color="dimmed" className={classes.description} size="sm">
          {local.children}
        </Text>
      </div>

      {!local.disallowClose && (
        <CloseButton
          iconSize={16}
          color="gray"
          {...local.closeButtonProps}
          onClick={local.onClose}
          className={classes.closeButton}
        />
      )}
    </Box>
  );
};

Notification.displayName = "@mantine/core/Notification";
