import {
  ComponentProps,
  createComponent,
  createMemo,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";
import {
  MantineColor,
  DefaultProps,
  MantineNumberSize,
  MantineSize,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import {
  ComponentObject,
  ForwardRefWithStaticComponents,
  inspectChildren,
  isComponentObject,
} from "utils";
import { Box } from "../Box";
import { Step, StepProps, StepStylesNames } from "./Step/Step";
import {
  StepCompleted,
  StepCompletedProps,
} from "./StepCompleted/StepCompleted";
import useStyles from "./Stepper.styles";

export type StepperStylesNames = Selectors<typeof useStyles> | StepStylesNames;

export interface StepperProps
  extends DefaultProps<StepperStylesNames>,
    ComponentProps<"div"> {
  /** <Stepper.Step /> components only */
  children: JSXElement;

  /** Called when step is clicked */
  onStepClick?(stepIndex: number): void;

  /** Active step index */
  active: number;

  /** Step icon displayed when step is completed */
  completedIcon?: JSXElement;

  /** Step icon displayed when step is in progress */
  progressIcon?: JSXElement;

  /** Active and progress Step colors from theme.colors */
  color?: MantineColor;

  /** Step icon size in px */
  iconSize?: number;

  /** Content padding-top from theme.spacing or number to set value in px */
  contentPadding?: MantineNumberSize;

  /** Component orientation */
  orientation?: "vertical" | "horizontal";

  /** Icon position relative to step body */
  iconPosition?: "right" | "left";

  /** Component size */
  size?: MantineSize;

  /** Radius from theme.radius, or number to set border-radius in px */
  radius?: MantineNumberSize;

  /** Breakpoint at which orientation will change from horizontal to vertical */
  breakpoint?: MantineNumberSize;
}

type StepperComponent = ForwardRefWithStaticComponents<
  StepperProps,
  {
    Step: typeof Step;
    Completed: typeof StepCompleted;
  }
>;

const defaultProps: Partial<StepperProps> = {
  contentPadding: "md",
  size: "md",
  radius: "xl",
  orientation: "horizontal",
  iconPosition: "left",
};

export const Stepper: StepperComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Stepper", defaultProps, props),
    [
      "className",
      "children",
      "onStepClick",
      "active",
      "completedIcon",
      "progressIcon",
      "color",
      "iconSize",
      "contentPadding",
      "size",
      "radius",
      "orientation",
      "breakpoint",
      "iconPosition",
      "classNames",
      "styles",
      "unstyled",
    ]
  );

  const { classes, cx } = useStyles(
    {
      contentPadding: local.contentPadding,
      color: local.color,
      orientation: local.orientation,
      iconPosition: local.iconPosition,
      size: local.size,
      iconSize: local.iconSize,
      breakpoint: local.breakpoint,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Stepper",
    }
  );

  const children = inspectChildren(() => local.children);

  const _children = createMemo(() =>
    children().filter(
      (child) => isComponentObject(child) && child.Component !== StepCompleted
    )
  );

  const completedStep = createMemo(() =>
    children().find((child) => isComponentObject(child, StepCompleted))
  );

  const items = createMemo(() =>
    _children().reduce<JSXElement[]>(
      (acc, item: ComponentObject<StepProps>, index) => {
        const shouldAllowSelect =
          typeof item.props.allowStepSelect === "boolean"
            ? item.props.allowStepSelect
            : typeof local.onStepClick === "function";

        acc.push(
          createComponent(item.Component, {
            __staticSelector: "Stepper",
            icon: item.props.icon || index + 1,
            state:
              local.active === index
                ? "stepProgress"
                : local.active > index
                ? "stepCompleted"
                : "stepInactive",
            onClick: () =>
              shouldAllowSelect &&
              typeof local.onStepClick === "function" &&
              local.onStepClick(index),
            allowStepClick:
              shouldAllowSelect && typeof local.onStepClick === "function",
            completedIcon: item.props.completedIcon || local.completedIcon,
            progressIcon: item.props.progressIcon || local.progressIcon,
            color: item.props.color || local.color,
            iconSize: local.iconSize,
            size: local.size,
            radius: local.radius,
            classNames: local.classNames,
            styles: local.styles,
            iconPosition: item.props.iconPosition || local.iconPosition,
            orientation: local.orientation,
            unstyled: local.unstyled,
          })
        );

        if (
          local.orientation === "horizontal" &&
          index !== _children().length - 1
        ) {
          acc.push(
            <div
              class={cx(classes.separator, {
                [classes.separatorActive]: index < local.active,
              })}
            />
          );
        }

        return acc;
      },
      []
    )
  );

  const content = createMemo(() =>
    local.active > _children().length - 1
      ? (completedStep() as ComponentObject<StepCompletedProps>)?.props
          ?.children
      : (_children()[local.active] as ComponentObject<StepProps>)?.props
          ?.children
  );

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      <div class={classes.steps}>{items()}</div>
      <Show when={content()}>
        <div class={classes.content}>{content()}</div>
      </Show>
    </Box>
  );
};

Stepper.Step = Step;
Stepper.Completed = StepCompleted;
Stepper.displayName = "@mantine/core/Stepper";
