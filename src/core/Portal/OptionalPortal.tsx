import { children, Show, splitProps } from "solid-js";
import { Portal, PortalProps } from "./Portal";

export interface OptionalPortalProps extends PortalProps {
  /** Determines if children should be rendered in Portal */
  withinPortal?: boolean;
}

export function OptionalPortal(props: OptionalPortalProps) {
  const [local, others] = splitProps(props, ["withinPortal", "children"]);

  const _children = children(() => local.children);

  return (
    <Show
      when={local.withinPortal === undefined || local.withinPortal}
      fallback={_children()}
    >
      <Portal {...others}>{_children()}</Portal>
    </Show>
  );
}

OptionalPortal.displayName = "@mantine/core/OptionalPortal";
