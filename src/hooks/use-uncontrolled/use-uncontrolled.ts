import { Accessor, createSignal } from "solid-js";

interface UseUncontrolledInput<T> {
  /** Value for controlled state */
  value?: Accessor<T>;

  /** Initial value for uncontrolled state */
  defaultValue?: T;

  /** Final value for uncontrolled state when value and defaultValue are not provided */
  finalValue?: T;

  /** Controlled state onChange handler */
  onChange?(value: T): void;
}

export function useUncontrolled<T>({
  value,
  defaultValue,
  finalValue,
  onChange = () => {},
}: UseUncontrolledInput<T>): [Accessor<T>, (v: T) => void, boolean] {
  const [uncontrolledValue, setUncontrolledValue] = createSignal(
    defaultValue !== undefined ? defaultValue : finalValue
  );

  const handleUncontrolledChange = (val: T) => {
    setUncontrolledValue(val as any);
    onChange?.(val);
  };

  if (value?.() !== undefined) {
    return [value as Accessor<T>, onChange, true];
  }

  return [uncontrolledValue as Accessor<T>, handleUncontrolledChange, false];
}
