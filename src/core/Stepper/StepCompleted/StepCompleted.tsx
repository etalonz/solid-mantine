import { JSXElement } from "solid-js";
import { defineInspectable } from "utils";

export interface StepCompletedProps {
  /** Label content */
  children: JSXElement;
}

function StepCompleted_(
  // Props should be kept for ts integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: StepCompletedProps
) {
  return null;
}

StepCompleted_.displayName = "@mantine/core/StepCompleted";

export const StepCompleted = defineInspectable(StepCompleted_);
