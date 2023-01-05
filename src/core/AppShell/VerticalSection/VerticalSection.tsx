import {
  ComponentWithRef,
  DefaultProps,
  getDefaultZIndex,
  Global,
} from "styles";
import { Box } from "../../Box";
import { useAppShellContext } from "../AppShell.context";
import useStyles, {
  VerticalSectionPosition,
  VerticalSectionHeight,
} from "./VerticalSection.styles";
import { getSortedBreakpoints } from "../HorizontalSection/get-sorted-breakpoints/get-sorted-breakpoints";
import {
  FlowProps,
  JSX,
  ComponentProps,
  splitProps,
  mergeProps,
  createMemo,
} from "solid-js";

export interface VerticalSectionSharedProps extends FlowProps<DefaultProps> {
  /** Component height with breakpoints */
  height: VerticalSectionHeight;

  /** Border */
  withBorder?: boolean;

  /** Changes position to fixed, controlled by AppShell component if rendered inside */
  fixed?: boolean;

  /** Control top, left, right or bottom position values, controlled by AppShell component if rendered inside */
  position?: VerticalSectionPosition;

  /** z-index */
  zIndex?: JSX.CSSProperties["z-index"];
}

interface VerticalSectionProps
  extends VerticalSectionSharedProps,
    Omit<ComponentProps<"div">, "children" | "ref"> {
  section: "header" | "footer";
  __staticSelector: string;
}

export const VerticalSection: ComponentWithRef<
  VerticalSectionProps,
  HTMLElement
> = (props) => {
  const ctx = useAppShellContext();
  const [local, others] = splitProps(
    mergeProps(
      { fixed: false, withBorder: true, zIndex: getDefaultZIndex("app") },
      props
    ),
    [
      "children",
      "className",
      "classNames",
      "styles",
      "height",
      "fixed",
      "withBorder",
      "position",
      "zIndex",
      "section",
      "unstyled",
      "__staticSelector",
    ]
  );

  const { classes, cx, theme } = useStyles(
    {
      height: local.height,
      fixed: ctx.fixed || local.fixed,
      position: local.position,
      zIndex: ctx.zIndex || local.zIndex,
      borderPosition: local.withBorder
        ? local.section === "header"
          ? "bottom"
          : "top"
        : "none",
    },
    {
      name: local.__staticSelector,
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );

  const breakpoints = createMemo(() =>
    typeof local.height === "object" && local.height !== null
      ? getSortedBreakpoints(local.height, theme).reduce(
          (acc, [breakpoint, breakpointSize]) => {
            acc[`@media (min-width: ${breakpoint}px)`] = {
              [`--mantine-${local.section}-height`]: `${breakpointSize}px`,
            };

            return acc;
          },
          {}
        )
      : null
  );

  return (
    <Box
      component={local.section === "header" ? "header" : "footer"}
      className={cx(classes.root, local.className)}
      {...others}
    >
      {local.children}
      <Global
        styles={() => ({
          ":root": {
            [`--mantine-${local.section}-height`]:
              typeof local.height === "object"
                ? `${local.height?.base}px` || "100%"
                : `${local.height}px`,
            ...breakpoints(),
          },
        })}
      />
    </Box>
  );
};

VerticalSection.displayName = "@mantine/core/VerticalSection";
