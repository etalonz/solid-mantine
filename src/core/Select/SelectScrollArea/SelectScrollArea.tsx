import { JSX, splitProps } from "solid-js";
import { ScrollArea, ScrollAreaProps } from "../../ScrollArea";

export const SelectScrollArea = (props: ScrollAreaProps) => {
  const [local, others] = splitProps(props, ["style"]);

  return (
    <ScrollArea
      {...others}
      style={{ width: "100%", ...(local.style as JSX.CSSProperties) }}
    >
      {others.children}
    </ScrollArea>
  );
};

SelectScrollArea.displayName = "@mantine/core/SelectScrollArea";
