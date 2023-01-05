import { ComponentProps } from "solid-js";

export function RadioIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 5 5"
      {...props}
    >
      <path fill="currentColor" d="M0 2.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
    </svg>
  );
}
