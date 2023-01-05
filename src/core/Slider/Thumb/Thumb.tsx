import { createMemo, createSignal, JSXElement, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  Selectors,
  ComponentWithRef,
} from "styles";
import { Box } from "../../Box";
import { Transition, MantineTransition } from "../../Transition";
import useStyles from "./Thumb.styles";

export type ThumbStylesNames = Selectors<typeof useStyles>;

export interface ThumbProps extends DefaultProps<ThumbStylesNames> {
  max: number;
  min: number;
  value: number;
  position: number;
  dragging: boolean;
  color: MantineColor;
  size: MantineNumberSize;
  label: JSXElement;
  onMouseDown(event: MouseEvent | TouchEvent): void;
  labelTransition?: MantineTransition;
  labelTransitionDuration?: number;
  labelTransitionTimingFunction?: string;
  labelAlwaysOn: boolean;
  thumbLabel: string;
  onFocus?(): void;
  onBlur?(): void;
  showLabelOnHover?: boolean;
  children?: JSXElement;
  disabled: boolean;
  thumbSize: number;
}

export const Thumb: ComponentWithRef<ThumbProps, HTMLDivElement> = (props) => {
  const [local] = splitProps(props, ["ref"]); // props.ref doesn't work for some reason when the calling code doesn't want the ref
  const { classes, cx, theme } = useStyles(
    {
      color: props.color,
      size: props.size,
      disabled: props.disabled,
      thumbSize: props.thumbSize,
    },
    {
      classNames: props.classNames,
      styles: props.styles,
      unstyled: props.unstyled,
      name: "Slider",
    }
  );

  const [focused, setFocused] = createSignal(false);
  const isVisible = createMemo(
    () =>
      props.labelAlwaysOn ||
      props.dragging ||
      focused() ||
      props.showLabelOnHover
  );

  return (
    <Box<"div">
      tabIndex={0}
      role="slider"
      aria-label={props.thumbLabel}
      aria-valuemax={props.max}
      aria-valuemin={props.min}
      aria-valuenow={props.value}
      ref={local.ref}
      className={cx(classes.thumb, { [classes.dragging]: props.dragging })}
      onFocus={() => {
        setFocused(true);
        typeof props.onFocus === "function" && props.onFocus();
      }}
      onBlur={() => {
        setFocused(false);
        typeof props.onBlur === "function" && props.onBlur();
      }}
      onTouchStart={props.onMouseDown}
      onMouseDown={props.onMouseDown}
      onClick={(event) => event.stopPropagation()}
      style={{ [theme.dir === "rtl" ? "right" : "left"]: `${props.position}%` }}
    >
      {props.children}
      <Transition
        mounted={props.label != null && isVisible()}
        duration={props.labelTransitionDuration}
        transition={props.labelTransition}
        timingFunction={
          props.labelTransitionTimingFunction || theme.transitionTimingFunction
        }
      >
        <div class={classes.label}>{props.label}</div>
      </Transition>
    </Box>
  );
};

Thumb.displayName = "@mantine/core/SliderThumb";
