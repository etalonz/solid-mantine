import { ComponentProps, Show, splitProps } from "solid-js";

export interface CheckboxIconProps extends Omit<ComponentProps<"svg">, "ref"> {
  indeterminate: boolean;
}

export function CheckIcon(props: Omit<ComponentProps<"svg">, "ref">) {
  return (
    <svg
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      />
    </svg>
  );
}

export function CheckboxIcon(props: CheckboxIconProps) {
  const [local, others] = splitProps(props, ["indeterminate"]);

  return (
    <Show when={local.indeterminate} fallback={() => <CheckIcon {...others} />}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 32 6"
        {...others}
      >
        <rect width="32" height="6" fill="currentColor" rx="3" />
      </svg>
    </Show>
  );
}
