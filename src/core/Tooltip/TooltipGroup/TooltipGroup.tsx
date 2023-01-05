import { FloatingDelayGroup } from "floating-ui";
import { JSXElement } from "solid-js";
import { TooltipGroupProvider } from "./TooltipGroup.context";

export interface TooltipGroupProps {
  /** <Tooltip /> components */
  children: JSXElement;

  /** Open delay in ms */
  openDelay?: number;

  /** Close delay in ms */
  closeDelay?: number;
}

export function TooltipGroup(props: TooltipGroupProps) {
  return (
    <TooltipGroupProvider value>
      <FloatingDelayGroup
        delay={{ open: props.openDelay || 0, close: props.closeDelay || 0 }}
      >
        {props.children}
      </FloatingDelayGroup>
    </TooltipGroupProvider>
  );
}

TooltipGroup.displayName = "@mantine/core/TooltipGroup";
