import {
  DefaultProps,
  MantineColor,
  Selectors,
  MantineSize,
  MantineNumberSize,
  Component,
  useComponentDefaultProps,
} from "styles";
import { defineInspectable } from "utils";
import { Text } from "../../Text";
import { Loader } from "../../Loader";
import { CheckboxIcon } from "../../Checkbox";
import { UnstyledButton } from "../../UnstyledButton";
import { Transition } from "../../Transition";
import useStyles from "./Step.styles";
import {
  ComponentProps,
  createMemo,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";

export type StepStylesNames = Selectors<typeof useStyles>;

export interface StepProps
  extends DefaultProps<StepStylesNames>,
    ComponentProps<"button"> {
  /** Step state, controlled by Steps component */
  state?: "stepInactive" | "stepProgress" | "stepCompleted";

  /** Step color from theme.colors */
  color?: MantineColor;

  /** Should icon be displayed */
  withIcon?: boolean;

  /** Step icon, defaults to step index + 1 when rendered within Stepper */
  icon?: JSXElement;

  /** Step icon displayed when step is completed */
  completedIcon?: JSXElement;

  /** Step icon displayed when step is in progress */
  progressIcon?: JSXElement;

  /** Step label, render after icon */
  label?: JSXElement;

  /** Step description */
  description?: JSXElement;

  /** Icon wrapper size in px */
  iconSize?: number;

  /** Icon position relative to step body */
  iconPosition?: "right" | "left";

  /** Component size */
  size?: MantineSize;

  /** Radius from theme.radius, or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Indicates loading state on step */
  loading?: boolean;

  /** Set to false to disable clicks on step */
  allowStepClick?: boolean;

  /** Should step selection be allowed */
  allowStepSelect?: boolean;

  /** Static selector base */
  __staticSelector?: string;

  /** Component orientation */
  orientation?: "vertical" | "horizontal";
}

const defaultIconSizes = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 24,
};

const defaultProps: Partial<StepProps> = {
  withIcon: true,
  size: "md",
  radius: "xl",
  allowStepClick: true,
  iconPosition: "left",
  __staticSelector: "Step",
};

const Step_: Component<StepProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Step", defaultProps, props),
    [
      "className",
      "state",
      "color",
      "icon",
      "completedIcon",
      "progressIcon",
      "label",
      "description",
      "withIcon",
      "iconSize",
      "size",
      "radius",
      "loading",
      "allowStepClick",
      "allowStepSelect",
      "iconPosition",
      "__staticSelector",
      "classNames",
      "styles",
      "unstyled",
      "orientation",
    ]
  );
  const { classes, cx, theme } = useStyles(
    {
      color: local.color,
      iconSize: local.iconSize,
      size: local.size,
      radius: local.radius,
      allowStepClick: local.allowStepClick,
      iconPosition: local.iconPosition,
      orientation: local.orientation,
    },
    {
      name: local.__staticSelector,
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );

  const _iconSize = createMemo(() =>
    theme.fn.size({
      size: local.size,
      sizes: defaultIconSizes,
    })
  );

  const _icon = createMemo(() =>
    local.state === "stepCompleted"
      ? null
      : local.state === "stepProgress"
      ? local.progressIcon
      : local.icon
  );

  return (
    <UnstyledButton
      className={cx(classes.step, local.className)}
      tabIndex={local.allowStepClick ? 0 : -1}
      aria-label={local.state}
      data-progress={local.state === "stepProgress" || undefined}
      data-completed={local.state === "stepCompleted" || undefined}
      {...others}
    >
      <Show when={local.withIcon}>
        <div class={classes.stepWrapper}>
          <div
            class={classes.stepIcon}
            data-progress={local.state === "stepProgress" || undefined}
            data-completed={local.state === "stepCompleted" || undefined}
          >
            <Transition
              mounted={local.state === "stepCompleted"}
              transition="pop"
              duration={200}
            >
              <div class={classes.stepCompletedIcon}>
                <Show
                  when={local.loading}
                  fallback={
                    local.completedIcon || (
                      <CheckboxIcon
                        indeterminate={false}
                        width={_iconSize()}
                        height={_iconSize()}
                      />
                    )
                  }
                >
                  <Loader
                    color="#fff"
                    size={_iconSize()}
                    className={classes.stepLoader}
                  />
                </Show>
              </div>
            </Transition>

            <Show when={local.state !== "stepCompleted"}>
              <Show when={local.loading} fallback={_icon() || local.icon}>
                <Loader size={_iconSize()} color={local.color} />
              </Show>
            </Show>
          </div>

          <Show when={local.orientation === "vertical"}>
            <div
              class={cx(classes.verticalSeparator, {
                [classes.verticalSeparatorActive]:
                  local.state === "stepCompleted",
              })}
            />
          </Show>
        </div>
      </Show>

      <Show when={local.label || local.description}>
        <div class={classes.stepBody}>
          <Show when={local.label}>
            <Text className={classes.stepLabel}>{local.label}</Text>
          </Show>

          <Show when={local.description}>
            <Text className={classes.stepDescription} color="dimmed">
              {local.description}
            </Text>
          </Show>
        </div>
      </Show>
    </UnstyledButton>
  );
};

Step_.displayName = "@mantine/core/Step";

export const Step = defineInspectable(Step_);
