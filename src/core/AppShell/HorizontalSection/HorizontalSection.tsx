import {
  DefaultProps,
  MantineNumberSize,
  getDefaultZIndex,
  Global,
  ComponentWithRef,
} from "styles";
import { Box } from "../../Box";
import { useAppShellContext } from "../AppShell.context";
import { getSortedBreakpoints } from "./get-sorted-breakpoints/get-sorted-breakpoints";
import useStyles, {
  HorizontalSectionPosition,
  HorizontalSectionWidth,
} from "./HorizontalSection.styles";
import { FlowProps, JSX, ComponentProps, splitProps } from "solid-js";

export interface HorizontalSectionSharedProps extends DefaultProps, FlowProps {
  /** Component width with breakpoints */
  width?: HorizontalSectionWidth;

  /** Component height */
  height?: string | number;

  /** Border */
  withBorder?: boolean;

  /** Set position to fixed */
  fixed?: boolean;

  /** Position for fixed variant */
  position?: HorizontalSectionPosition;

  /** Breakpoint at which component will be hidden if hidden prop is true */
  hiddenBreakpoint?: MantineNumberSize;

  /** Set to true to hide component at hiddenBreakpoint */
  hidden?: boolean;

  /** z-index */
  zIndex?: JSX.CSSProperties["z-index"];
}

export interface HorizontalSectionProps
  extends HorizontalSectionSharedProps,
    Omit<ComponentProps<"nav">, "children"> {
  section: "navbar" | "aside";
  __staticSelector: string;
}

export const HorizontalSection: ComponentWithRef<
  HorizontalSectionProps,
  HTMLElement
> = (props) => {
  const ctx = useAppShellContext();

  const [local, others] = splitProps(props, [
    "width",
    "height",
    "fixed",
    "position",
    "zIndex",
    "hiddenBreakpoint",
    "hidden",
    "withBorder",
    "className",
    "classNames",
    "styles",
    "children",
    "section",
    "__staticSelector",
    "unstyled",
  ]);

  const { classes, cx, theme } = useStyles(
    {
      width: local.width,
      height: local.height,
      fixed: ctx.fixed || local.fixed,
      position: local.position,
      hiddenBreakpoint: local.hiddenBreakpoint || "md",
      zIndex: ctx.zIndex || local.zIndex || getDefaultZIndex("app"),
      section: local.section,
      withBorder: local.withBorder === undefined ? true : local.withBorder,
    },
    {
      classNames: local.classNames,
      styles: local.styles,
      name: local.__staticSelector,
      unstyled: local.unstyled,
    }
  );

  const breakpoints = getSortedBreakpoints(local.width, theme).reduce(
    (acc, [breakpoint, breakpointSize]) => {
      acc[`@media (min-width: ${breakpoint}px)`] = {
        [`--mantine-${local.section}-width`]: `${breakpointSize}px`,
      };

      return acc;
    },
    {}
  );

  return (
    <Box
      component={local.section === "navbar" ? "nav" : "aside"}
      data-hidden={local.hidden || undefined}
      className={cx(classes.root, local.className)}
      {...others}
    >
      {local.children}

      <Global
        styles={() => ({
          ":root": {
            [`--mantine-${local.section}-width`]: local.width?.base
              ? `${local.width.base}px`
              : "0px",
            ...breakpoints,
          },
        })}
      />
    </Box>
  );
};

HorizontalSection.displayName = "@mantine/core/HorizontalSection";
