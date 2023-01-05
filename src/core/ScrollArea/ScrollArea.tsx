import { ComponentProps, JSX, Ref, splitProps } from "solid-js";
import {
  DefaultProps,
  Selectors,
  useComponentDefaultProps,
  Component,
} from "styles";
import { ForwardRefWithStaticComponents, packSx } from "utils";
import { Box } from "../Box";
import useStyles, { ScrollAreaStylesParams } from "./ScrollArea.styles";
import Scrollbars from "solid-custom-scrollbars";

export type ScrollAreaStylesNames = Selectors<typeof useStyles>;

export interface ScrollAreaProps
  extends DefaultProps<ScrollAreaStylesNames, ScrollAreaStylesParams>,
    ComponentProps<"div"> {
  /** Scrollbar size in px */
  scrollbarSize?: number;

  /** Scrollbars type */
  type?: "auto" | "always" | "scroll" | "hover" | "never";

  /** Scroll hide delay in ms, for scroll and hover types only */
  scrollHideDelay?: number;

  /** Reading direction of the scroll area */
  dir?: "ltr" | "rtl";

  /** Should scrollbars be offset with padding */
  offsetScrollbars?: boolean;

  /** Get viewport ref */
  viewportRef?: Ref<HTMLDivElement>;

  /** Subscribe to scroll position changes */
  onScrollPositionChange?(position: { x: number; y: number }): void;
}

const defaultProps: Partial<ScrollAreaProps> = {
  scrollbarSize: 10,
  scrollHideDelay: 1000,
  type: "hover",
  offsetScrollbars: true,
};

export const _ScrollArea: Component<ScrollAreaProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("ScrollArea", defaultProps, props),
    [
      "ref",
      "children",
      "className",
      "classNames",
      "styles",
      "scrollbarSize",
      "scrollHideDelay",
      "type",
      "dir",
      "offsetScrollbars",
      "viewportRef",
      "onScrollPositionChange",
      "unstyled",
      "style",
    ]
  );

  const { classes, cx } = useStyles(
    {
      scrollbarSize: local.scrollbarSize,
      offsetScrollbars: local.offsetScrollbars,
      hidden: local.type === "never",
    },
    {
      name: "ScrollArea",
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );

  const trackV = (p) => {
    const [_, otherStyles] = splitProps(p.style, ["width"]);
    return (
      <div
        data-orientation="vertical"
        style={otherStyles}
        ref={p.ref}
        id={p.id}
        class={classes.scrollbar}
      >
        {p.children}
      </div>
    );
  };

  const trackH = (p) => {
    const [_, otherStyles] = splitProps(p.style, ["height"]);
    return (
      <div
        data-orientation="horizontal"
        style={otherStyles}
        ref={p.ref}
        id={p.id}
        class={classes.scrollbar}
      >
        {p.children}
      </div>
    );
  };

  const thumb = (p) => (
    <div style={p.style} ref={p.ref} id={p.id} class={classes.thumb}>
      {p.children}
    </div>
  );

  const view = (p) => {
    const [viewLocal, others] = splitProps(p, ["style"]);
    const [styleLocal, styleOthers] = splitProps(viewLocal.style, ["position"]);
    return (
      <div
        {...others}
        style={{
          position:
            (local.style as JSX.CSSProperties)?.height === undefined
              ? undefined
              : styleLocal.position,
          ...styleOthers,
        }}
      />
    );
  };

  return (
    <Box
      className={cx(classes.root, local.className)}
      style={local.style}
      {...others}
      ref={local.ref}
    >
      <Scrollbars
        renderView={view}
        renderTrackVertical={trackV}
        renderThumbVertical={thumb}
        renderTrackHorizontal={trackH}
        renderThumbHorizontal={thumb}
        autoHide={local.type === "hover"}
        autoHideTimeout={local.scrollHideDelay}
      >
        {local.children}
      </Scrollbars>
    </Box>
  );
};

export interface ScrollAreaAutosizeProps extends ScrollAreaProps {
  maxHeight: JSX.CSSProperties["max-height"];
}

const ScrollAreaAutosize: Component<ScrollAreaAutosizeProps> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps<ScrollAreaAutosizeProps>(
      "ScrollAreaAutosize",
      defaultProps,
      props
    ),
    [
      "maxHeight",
      "children",
      "classNames",
      "styles",
      "scrollbarSize",
      "scrollHideDelay",
      "type",
      "dir",
      "offsetScrollbars",
      "ref",
      "onScrollPositionChange",
      "unstyled",
      "sx",
    ]
  );

  return (
    <Box
      {...others}
      sx={[
        { display: "flex", maxHeight: local.maxHeight },
        ...packSx(local.sx),
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <_ScrollArea
          classNames={local.classNames}
          styles={local.styles}
          scrollHideDelay={local.scrollHideDelay}
          scrollbarSize={local.scrollbarSize}
          type={local.type}
          dir={local.dir}
          offsetScrollbars={local.offsetScrollbars}
          ref={local.ref}
          onScrollPositionChange={local.onScrollPositionChange}
          unstyled={local.unstyled}
        >
          {local.children}
        </_ScrollArea>
      </Box>
    </Box>
  );
};
ScrollAreaAutosize.displayName = "@mantine/core/ScrollAreaAutosize";
_ScrollArea.displayName = "@mantine/core/ScrollArea";
(_ScrollArea as any).Autosize = ScrollAreaAutosize;

export const ScrollArea: ForwardRefWithStaticComponents<
  ScrollAreaProps,
  {
    Autosize: typeof ScrollAreaAutosize;
  }
> = _ScrollArea as any;
