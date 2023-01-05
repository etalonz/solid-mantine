import { createSignal, createEffect, on, createMemo } from "solid-js";
import { ComponentWithRef } from "styles";
import useStyles from "./MachineNumber.styles";

interface MachineNumberProps {
  value: number | string;
  newOriginalNumber: number;
  oldOriginalNumber: number;
}

export const MachineNumber: ComponentWithRef<
  MachineNumberProps,
  HTMLDivElement
> = (props) => {
  const [oldNumber, setOldNumber] = createSignal(props.value);
  const [newNumber, setNewNumber] = createSignal(props.value);
  const [scrollAnimationDirection, setScrollAnimationDirection] = createSignal<
    "up" | "down"
  >("up");
  const [isActive, setIsActive] = createSignal(false);

  const [prevValue, setPrevValue] = createSignal<string | number>();

  createEffect(
    on(
      () => props.value,
      (p) => setPrevValue(p)
    )
  );

  const scrollByDir = (dir: "up" | "down") => {
    setIsActive(true);
    setScrollAnimationDirection(dir);
    setTimeout(() => {
      setIsActive(false);
    }, 180);
  };

  const scroll = () => {
    const { newOriginalNumber, oldOriginalNumber } = props;

    if (newOriginalNumber == null || oldOriginalNumber == null) {
      return;
    }

    if (newOriginalNumber > oldOriginalNumber) {
      scrollByDir("up");
    } else if (newOriginalNumber < oldOriginalNumber) {
      scrollByDir("down");
    }
  };

  createEffect(() => {
    setOldNumber(prevValue);
    setNewNumber(props.value);
    scroll();
  });

  const { classes, cx } = useStyles(null, { name: "MachineNumber" });

  const newNumberScrollAnimationClass = createMemo(() =>
    isActive()
      ? scrollAnimationDirection() === "up"
        ? classes.currentNumberScrollUp
        : classes.currentNumberScrollDown
      : null
  );
  const oldNumberScrollAnimationClass = createMemo(() =>
    isActive()
      ? scrollAnimationDirection() === "up"
        ? classes.oldNumberScrollUp
        : classes.oldNumberScrollDown
      : null
  );
  return (
    <span ref={props.ref} class={classes.baseNumber}>
      {(oldNumber() && (
        <span
          class={cx(
            classes.oldNumber,
            classes.currentNumberTop,
            oldNumberScrollAnimationClass()
          )}
        >
          {oldNumber()}
        </span>
      )) ||
        null}
      <span>
        <span
          class={cx(classes.currentNumber, newNumberScrollAnimationClass())}
        >
          {newNumber()}
        </span>
      </span>
      {(oldNumber() && (
        <span
          class={cx(
            classes.oldNumber,
            classes.oldNumberBottom,
            oldNumberScrollAnimationClass()
          )}
        >
          {oldNumber()}
        </span>
      )) ||
        null}
    </span>
  );
};
