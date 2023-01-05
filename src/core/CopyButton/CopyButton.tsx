import { useClipboard } from "hooks";
import { JSXElement, splitProps } from "solid-js";
import { useComponentDefaultProps } from "styles";

export interface CopyButtonProps {
  /** Function called with current status */
  children(payload: { copied: boolean; copy(): void }): JSXElement;

  /** Value that should be copied to the clipboard */
  value: string;

  /** Copied status timeout in ms */
  timeout?: number;
}

const defaultProps: Partial<CopyButtonProps> = {
  timeout: 1000,
};

export function CopyButton(props: CopyButtonProps) {
  const [local, others] = splitProps(
    useComponentDefaultProps("CopyButton", defaultProps, props),
    ["children", "timeout", "value"]
  );
  const clipboard = useClipboard({ timeout: local.timeout });
  const copy = () => clipboard.copy(local.value);
  return <>{local.children({ copy, copied: clipboard.copied, ...others })}</>;
}

CopyButton.displayName = "@mantine/core/CopyButton";
