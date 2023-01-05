import { ComponentProps, For, JSXElement, Show, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  Selectors,
  useComponentDefaultProps,
  Component,
} from "styles";
import { Box } from "../Box";
import { Text } from "../Text";
import { Tooltip } from "../Tooltip";
import useStyles, { ProgressStylesParams } from "./Progress.styles";

export type ProgressStylesNames = Selectors<typeof useStyles>;

interface ProgressSection extends ComponentProps<"div"> {
  value: number;
  color: MantineColor;
  label?: string;
  tooltip?: JSXElement;
}

export interface ProgressProps
  extends DefaultProps<ProgressStylesNames, ProgressStylesParams>,
    ComponentProps<"div"> {
  /** Percent of filled bar (0-100) */
  value?: number;

  /** Progress color from theme */
  color?: MantineColor;

  /** Predefined progress height or number for height in px */
  size?: MantineNumberSize;

  /** Predefined progress radius from theme.radius or number for height in px */
  radius?: MantineNumberSize;

  /** Adds stripes */
  striped?: boolean;

  /** Whether to animate striped progress bars */
  animate?: boolean;

  /** Text to be placed inside the progress bar */
  label?: string;

  /** Replaces value if present, renders multiple sections instead of single one */
  sections?: ProgressSection[];
}

function getCumulativeSections(
  sections: ProgressSection[]
): (ProgressSection & { accumulated: number })[] {
  return sections.reduce(
    (acc, section) => {
      acc.sections.push({ ...section, accumulated: acc.accumulated });
      acc.accumulated += section.value;
      return acc;
    },
    { accumulated: 0, sections: [] }
  ).sections;
}

const defaultProps: Partial<ProgressProps> = {
  size: "md",
  radius: "sm",
  striped: false,
  animate: false,
  label: "",
};

export const Progress: Component<ProgressProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Progress", defaultProps, props),
    [
      "className",
      "value",
      "color",
      "size",
      "radius",
      "striped",
      "animate",
      "label",
      "aria-label",
      "classNames",
      "styles",
      "sections",
      "unstyled",
    ]
  );

  const { classes, cx, theme } = useStyles(
    {
      color: local.color,
      size: local.size,
      radius: local.radius,
      striped: local.striped || local.animate,
      animate: local.animate,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      name: "Progress",
    }
  );

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      <Show
        when={Array.isArray(local.sections)}
        fallback={() => (
          <div
            role="progressbar"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={local.value}
            aria-label={local["aria-label"]}
            class={classes.bar}
            style={{ width: `${local.value}%` }}
          >
            <Show when={local.label}>
              <Text className={classes.label}>{local.label}</Text>
            </Show>
          </div>
        )}
      >
        <For each={getCumulativeSections(local.sections)}>
          {({
            tooltip,
            accumulated,
            value: sectionValue,
            label: sectionLabel,
            color: sectionColor,
            ...sectionProps
          }) => {
            return (
              <Tooltip.Floating label={tooltip} disabled={!tooltip}>
                <Box
                  {...sectionProps}
                  className={cx(classes.bar, sectionProps.class)}
                  sx={{
                    width: `${sectionValue}%`,
                    left: `${accumulated}%`,
                    backgroundColor: theme.fn.variant({
                      variant: "filled",
                      primaryFallback: false,
                      color: sectionColor || theme.primaryColor,
                    }).background,
                  }}
                >
                  {sectionLabel && (
                    <Text className={classes.label}>{sectionLabel}</Text>
                  )}
                </Box>
              </Tooltip.Floating>
            );
          }}
        </For>
      </Show>
    </Box>
  );
};

Progress.displayName = "@mantine/core/Progress";
