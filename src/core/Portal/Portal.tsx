import { createRenderEffect, JSXElement, onCleanup } from "solid-js";
import { Portal as SolidPortal } from "solid-js/web";
import { useMantineTheme, useComponentDefaultProps } from "styles";

export interface PortalProps {
  /** Portal children, for example, modal or popover */
  children: JSXElement;

  /** Element where portal should be rendered, by default new div element is created and appended to document.body */
  target?: HTMLElement | string;

  /** Root element className */
  className?: string;
}

export function Portal(props: PortalProps) {
  const _props = useComponentDefaultProps("Portal", {}, props);

  const theme = useMantineTheme();
  let ref: HTMLElement;

  createRenderEffect(() => {
    ref = !_props.target
      ? document.createElement("div")
      : typeof _props.target === "string"
      ? document.querySelector(_props.target)
      : _props.target;

    if (!_props.target) {
      document.body.appendChild(ref);
    }

    onCleanup(() => !_props.target && document.body.removeChild(ref));
  });

  return (
    <SolidPortal mount={ref}>
      <div class={_props.className} dir={theme.dir}>
        {_props.children}
      </div>
    </SolidPortal>
  );
}

Portal.displayName = "@mantine/core/Portal";
