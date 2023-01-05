import { MachineNumber } from "./MachineNumber";
import useStyles from "./Machine.styles";
import { ComponentWithRef } from "styles";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  on,
} from "solid-js";

interface MachineNumberProps {
  value: number | string;
  max: number;
}

export const Machine: ComponentWithRef<MachineNumberProps, HTMLDivElement> = (
  props
) => {
  const [oldValue, setOldValue] = createSignal<number>();
  const [newValue, setNewValue] = createSignal<number>();
  const [prevValue, setPrevValue] = createSignal<string | number>();

  createEffect(
    on(
      () => props.value,
      (p) => setPrevValue(p)
    )
  );

  createEffect(() => {
    if (typeof props.value === "string") {
      setOldValue(undefined);
      setNewValue(undefined);
    } else if (typeof prevValue() === "string") {
      setOldValue(undefined);
      setNewValue(props.value);
    } else {
      setOldValue(prevValue as Accessor<number>);
      setNewValue(props.value);
    }
  });

  const numbers = createMemo(() => {
    if (typeof props.value === "string") {
      return [];
    }

    if (props.value < 1) {
      return [0];
    }

    const result: number[] = [];
    let currentValue = props.value;

    if (typeof props.max === "number") {
      currentValue = Math.min(props.max, currentValue);
    }

    while (currentValue >= 1) {
      result.push(currentValue % 10);
      currentValue /= 10;
      currentValue = Math.floor(currentValue);
    }

    result.reverse();
    return result;
  });

  const { classes } = useStyles(null, { name: "machine" });

  return typeof props.value === "string" ? (
    <span ref={props.ref}>{props.value}</span>
  ) : (
    <span ref={props.ref} class={classes.base}>
      <For each={numbers()}>
        {(number) => (
          <MachineNumber
            value={number}
            oldOriginalNumber={oldValue()}
            newOriginalNumber={newValue()}
          />
        )}
      </For>
      {typeof props.max === "number" && props.value > props.max && (
        <span>+</span>
      )}
    </span>
  );
};
