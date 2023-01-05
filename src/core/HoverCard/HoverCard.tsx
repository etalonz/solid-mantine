import { useComponentDefaultProps } from "styles";
import { useDisclosure } from "hooks";
import { useDelayedHover } from "../Floating";
import { Popover, PopoverBaseProps } from "../Popover";
import { HoverCardContextProvider } from "./HoverCard.context";
import { HoverCardDropdown } from "./HoverCardDropdown/HoverCardDropdown";
import { HoverCardTarget } from "./HoverCardTarget/HoverCardTarget";
import { JSXElement, splitProps } from "solid-js";

export interface HoverCardProps extends PopoverBaseProps {
  /** HoverCard.Target and HoverCard.Dropdown components */
  children?: JSXElement;

  /** Initial opened state */
  initiallyOpened?: boolean;

  /** Called when dropdown is opened */
  onOpen?(): void;

  /** Called when dropdown is closed */
  onClose?(): void;

  /** Open delay in ms */
  openDelay?: number;

  /** Close delay in ms */
  closeDelay?: number;
}

const defaultProps: Partial<HoverCardProps> = {
  openDelay: 0,
  closeDelay: 150,
  initiallyOpened: false,
};

export function HoverCard(props: HoverCardProps) {
  const [local, others] = splitProps(
    useComponentDefaultProps("HoverCard", defaultProps, props),
    [
      "children",
      "onOpen",
      "onClose",
      "openDelay",
      "closeDelay",
      "initiallyOpened",
    ]
  );

  const [opened, { open, close }] = useDisclosure(local.initiallyOpened, {
    onClose: local.onClose,
    onOpen: local.onOpen,
  });

  const { openDropdown, closeDropdown } = useDelayedHover({
    open,
    close,
    openDelay: local.openDelay,
    closeDelay: local.closeDelay,
  });

  return (
    <HoverCardContextProvider value={{ openDropdown, closeDropdown }}>
      <Popover opened={opened()} __staticSelector="HoverCard" {...others}>
        {local.children}
      </Popover>
    </HoverCardContextProvider>
  );
}

HoverCard.displayName = "@mantine/core/HoverCard";
HoverCard.Target = HoverCardTarget;
HoverCard.Dropdown = HoverCardDropdown;
