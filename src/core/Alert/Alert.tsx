import {
  DefaultProps,
  MantineColor,
  Selectors,
  MantineNumberSize,
  useComponentDefaultProps,
} from "styles";
import { useId } from "hooks";
import { CloseButton } from "../CloseButton";
import { Box } from "../Box";
import useStyles, { AlertStylesParams, AlertVariant } from "./Alert.styles";
import { ComponentProps, FlowProps, JSXElement, splitProps } from "solid-js";

export type AlertStylesNames = Selectors<typeof useStyles>;

export interface AlertProps
  extends DefaultProps<AlertStylesNames, AlertStylesParams>,
    FlowProps<Omit<ComponentProps<"div">, "title">> {
  /** Alert title */
  title?: JSXElement;

  /** Controls Alert background, color and border styles, defaults to light */
  variant?: AlertVariant;

  /** Color from theme.colors */
  color?: MantineColor;

  /** Icon displayed next to title */
  icon?: JSXElement;

  /** True to display close button */
  withCloseButton?: boolean;

  /** Called when close button is clicked */
  onClose?(): void;

  /** Close button aria-label */
  closeButtonLabel?: string;

  /** Radius from theme.radius, or number to set border-radius in px, defaults to theme.defaultRadius */
  radius?: MantineNumberSize;
}

const defaultProps: Partial<AlertProps> = {
  variant: "light",
};

export const Alert = (props: AlertProps) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Alert", defaultProps, props),
    [
      "id",
      "className",
      "title",
      "variant",
      "children",
      "color",
      "classNames",
      "icon",
      "styles",
      "onClose",
      "radius",
      "withCloseButton",
      "closeButtonLabel",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    { color: local.color, radius: local.radius, variant: local.variant },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Alert",
    }
  );

  const rootId = useId(local.id);
  const titleId = local.title && `${rootId}-title`;
  const bodyId = `${rootId}-body`;

  return (
    <Box
      id={rootId}
      role="alert"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className={cx(classes.root, classes[local.variant], local.className)}
      {...others}
    >
      <div class={classes.wrapper}>
        {local.icon && <div class={classes.icon}>{local.icon}</div>}

        <div class={classes.body}>
          {local.title && (
            <div
              class={classes.title}
              data-with-close-button={local.withCloseButton || undefined}
            >
              <span id={titleId} class={classes.label}>
                {local.title}
              </span>
            </div>
          )}

          {local.withCloseButton && (
            <CloseButton
              className={classes.closeButton}
              onClick={local.onClose}
              variant="transparent"
              size={16}
              iconSize={16}
              aria-label={local.closeButtonLabel}
            />
          )}

          <div id={bodyId} class={classes.message}>
            {local.children}
          </div>
        </div>
      </div>
    </Box>
  );
};

Alert.displayName = "@mantine/core/Alert";
