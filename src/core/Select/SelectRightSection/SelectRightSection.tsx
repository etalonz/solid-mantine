import { Show } from "solid-js";
import { MantineSize } from "styles";
import { CloseButton } from "../../CloseButton";
import { ChevronIcon } from "./ChevronIcon";

export interface SelectRightSectionProps {
  shouldClear: boolean;
  clearButtonLabel?: string;
  onClear?: () => void;
  size: MantineSize;
  error?: any;
  // eslint-disable-next-line react/no-unused-prop-types
  disabled?: boolean;
  clearButtonTabIndex?: number;
}

export function SelectRightSection(props: SelectRightSectionProps) {
  return (
    <Show
      when={props.shouldClear}
      fallback={<ChevronIcon error={props.error} size={props.size} />}
    >
      <CloseButton
        variant="transparent"
        aria-label={props.clearButtonLabel}
        onClick={props.onClear}
        size={props.size}
        tabIndex={props.clearButtonTabIndex}
      />
    </Show>
  );
}

SelectRightSection.displayName = "@mantine/core/SelectRightSection";
