import {
  MantineNumberSize,
  DefaultProps,
  Selectors,
  MantineStyleSystemSize,
  getDefaultZIndex,
  useComponentDefaultProps,
  ComponentWithRef,
} from "styles";
import { Box } from "../Box";
import { AppShellProvider } from "./AppShell.context";
import useStyles from "./AppShell.styles";
import { FlowProps, JSX, JSXElement, splitProps } from "solid-js";

export type AppShellStylesNames = Selectors<typeof useStyles>;

export interface AppShellProps
  extends FlowProps<
    Omit<DefaultProps<AppShellStylesNames>, MantineStyleSystemSize>
  > {
  /** <Navbar /> component */
  navbar?: JSXElement;

  /** <Aside /> component */
  aside?: JSXElement;

  /** <Header /> component */
  header?: JSXElement;

  /** <Footer /> component */
  footer?: JSXElement;

  /** zIndex prop passed to Navbar and Header components */
  zIndex?: JSX.CSSProperties["z-index"];

  /** true to switch from static layout to fixed */
  fixed?: boolean;

  /** true to hide all AppShell parts and render only children */
  hidden?: boolean;

  /** Content padding */
  padding?: MantineNumberSize;

  /** Breakpoint at which Navbar component should no longer be offset with padding-left, applicable only for fixed position */
  navbarOffsetBreakpoint?: MantineNumberSize;

  /** Breakpoint at which Aside component should no longer be offset with padding-right, applicable only for fixed position */
  asideOffsetBreakpoint?: MantineNumberSize;
}

const defaultProps: Partial<AppShellProps> = {
  fixed: true,
  zIndex: getDefaultZIndex("app"),
  padding: "md",
};

export const AppShell: ComponentWithRef<AppShellProps, HTMLDivElement> = (
  props
) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("AppShell", defaultProps, props),
    [
      "children",
      "navbar",
      "header",
      "footer",
      "aside",
      "fixed",
      "zIndex",
      "padding",
      "navbarOffsetBreakpoint",
      "asideOffsetBreakpoint",
      "className",
      "styles",
      "classNames",
      "unstyled",
      "hidden",
    ]
  );

  const { classes, cx } = useStyles(
    {
      padding: local.padding,
      fixed: local.fixed,
      navbarOffsetBreakpoint: local.navbarOffsetBreakpoint,
      asideOffsetBreakpoint: local.asideOffsetBreakpoint,
    },
    {
      styles: local.styles,
      classNames: local.classNames,
      unstyled: local.unstyled,
      name: "AppShell",
    }
  );

  if (local.hidden) {
    return <>{local.children}</>;
  }

  return (
    <AppShellProvider value={{ fixed: local.fixed, zIndex: local.zIndex }}>
      <Box className={cx(classes.root, local.className)} {...others}>
        {local.header}

        <div class={classes.body}>
          {local.navbar}
          <main class={classes.main}>{local.children}</main>
          {local.aside}
        </div>

        {local.footer}
      </Box>
    </AppShellProvider>
  );
};

AppShell.displayName = "@mantine/core/AppShell";
