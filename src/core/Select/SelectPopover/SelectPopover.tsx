import {
  ClassNames,
  MantineShadow,
  Styles,
  Selectors,
  DefaultProps,
} from "styles";
import { SelectScrollArea } from "../SelectScrollArea/SelectScrollArea";
import { Popover } from "../../Popover";
import { Box } from "../../Box";
import { MantineTransition } from "../../Transition";
import useStyles from "./SelectPopover.styles";
import { FlowProps, JSX, JSXElement, Ref, splitProps } from "solid-js";

export type SelectPopoverStylesNames = Selectors<typeof useStyles>;

interface SelectPopoverDropdownProps
  extends FlowProps<DefaultProps<SelectPopoverStylesNames>> {
  id: string;
  component?: any;
  maxHeight?: number | string;
  direction?: JSX.CSSProperties["flex-direction"];
  innerRef?: Ref<HTMLDivElement>;
  __staticSelector?: string;
}

function SelectPopoverDropdown(props: SelectPopoverDropdownProps) {
  const [local, others] = splitProps(props, [
    "children",
    "component",
    "maxHeight",
    "direction",
    "id",
    "innerRef",
    "__staticSelector",
    "styles",
    "classNames",
    "unstyled",
  ]); // component = div, maxHeight = 220, direction = column

  const { classes } = useStyles(null, {
    name: local.__staticSelector,
    styles: local.styles,
    classNames: local.classNames,
    unstyled: local.unstyled,
  });

  return (
    <Popover.Dropdown
      p={0}
      onMouseDown={(event) => event.preventDefault()}
      {...others}
    >
      <div
        style={{ "max-height": `${local.maxHeight || 220}px`, display: "flex" }}
      >
        <Box<"div">
          component={(local.component || "div") as any}
          id={`${local.id}-items`}
          aria-labelledby={`${local.id}-label`}
          role="listbox"
          onMouseDown={(event) => event.preventDefault()}
          style={{
            flex: 1,
            "overflow-y":
              local.component !== SelectScrollArea ? "auto" : undefined,
          }}
          data-combobox-popover
          ref={local.innerRef}
        >
          <div
            class={classes.itemsWrapper}
            style={{ "flex-direction": local.direction }}
          >
            {local.children}
          </div>
        </Box>
      </div>
    </Popover.Dropdown>
  );
}

interface SelectPopoverProps {
  opened: boolean;
  transition?: MantineTransition;
  transitionDuration?: number;
  shadow?: MantineShadow;
  withinPortal?: boolean;
  children: JSXElement;
  __staticSelector?: string;
  onDirectionChange?(direction: JSX.CSSProperties["flex-direction"]): void;
  switchDirectionOnFlip?: boolean;
  zIndex?: JSX.CSSProperties["z-index"];
  dropdownPosition?: "bottom" | "top" | "flip";
  positionDependencies?: any[];
  classNames?: ClassNames<SelectPopoverStylesNames>;
  styles?: Styles<SelectPopoverStylesNames>;
  unstyled?: boolean;
  readOnly?: boolean;
}

export function SelectPopover(props: SelectPopoverProps) {
  // transition = fade, transitionDuration = 0, positionDependencies = []
  return (
    <Popover
      unstyled={props.unstyled}
      classNames={props.classNames}
      styles={props.styles}
      width="target"
      withRoles={false}
      opened={props.opened}
      middlewares={{ flip: props.dropdownPosition === "flip", shift: false }}
      position={
        props.dropdownPosition === "flip" ? "bottom" : props.dropdownPosition
      }
      positionDependencies={props.positionDependencies || []}
      zIndex={props.zIndex}
      __staticSelector={props.__staticSelector}
      withinPortal={props.withinPortal}
      transition={props.transition || "fade"}
      transitionDuration={props.transitionDuration ?? 0}
      shadow={props.shadow}
      disabled={props.readOnly}
      onPositionChange={(nextPosition) =>
        props.switchDirectionOnFlip &&
        props.onDirectionChange?.(
          nextPosition === "top" ? "column-reverse" : "column"
        )
      }
    >
      {props.children}
    </Popover>
  );
}

SelectPopover.Target = Popover.Target;
SelectPopover.Dropdown = SelectPopoverDropdown;
