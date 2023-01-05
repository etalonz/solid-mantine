import { useComponentDefaultProps } from "styles";
import { mergeRefs } from "@solid-primitives/refs";
import { JSXElement, Ref, splitProps } from "solid-js";

export interface FileButtonProps<Multiple extends boolean = false> {
  /** Called when files are picked */
  onChange(payload: Multiple extends true ? File[] : File | null): void;

  /** Function that receives button props and returns react node that should be rendered */
  children(props: { onClick(): void }): JSXElement;

  /** Determines whether user can pick more than one file */
  multiple?: Multiple;

  /** File input accept attribute, for example, "image/png,image/jpeg" */
  accept?: string;

  /** Input name attribute */
  name?: string;

  /** Input form attribute */
  form?: string;

  /** Function that should be called when value changes to null or empty array */
  resetRef?: Ref<any>;

  /** Disables file picker */
  disabled?: boolean;

  ref?: Ref<any>;
}

const defaultProps: Partial<FileButtonProps> = {
  multiple: false,
};

type FileButtonComponent = (<Multiple extends boolean = false>(
  props: FileButtonProps<Multiple>
) => JSXElement) & { displayName?: string };

export const FileButton: FileButtonComponent = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("FileButton", defaultProps as any, props),
    [
      "ref",
      "onChange",
      "children",
      "multiple",
      "accept",
      "name",
      "form",
      "resetRef",
      "disabled",
    ]
  );

  let inputRef: HTMLInputElement;

  const onClick = () => {
    !local.disabled && inputRef.click();
  };

  const handleChange = (event: any) => {
    if (local.multiple) {
      local.onChange(Array.from(event.currentTarget.files) as any);
    } else {
      local.onChange(event.currentTarget.files[0] || null);
    }
  };

  const reset = () => {
    inputRef.value = "";
  };

  if (typeof local.resetRef === "function") local.resetRef(reset);

  return (
    <>
      {local.children({ onClick, ...others })}

      <input
        style={{ display: "none" }}
        type="file"
        accept={local.accept}
        multiple={local.multiple}
        onChange={handleChange}
        ref={mergeRefs((e) => (inputRef = e), local.ref)}
        name={local.name}
        form={local.form}
      />
    </>
  );
};

FileButton.displayName = "@mantine/core/FileButton";
