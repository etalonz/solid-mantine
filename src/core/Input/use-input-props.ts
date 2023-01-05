import { useComponentDefaultProps, DefaultProps } from "styles";
import { extractSystemStyles } from "../Box";
import { useId } from "hooks";
import { InputWrapperBaseProps } from "./InputWrapper/InputWrapper";
import { InputSharedProps } from "./Input";
import { splitProps, Ref, mergeProps } from "solid-js";

interface BaseProps
  extends InputWrapperBaseProps,
    InputSharedProps,
    DefaultProps {
  __staticSelector?: string;
  id?: string;
  ref?: Ref<any>;
}

interface UseInputPropsReturnType extends Record<string, any> {
  wrapperProps: Record<string, any>;
  inputProps: Record<string, any>;
}

export function useInputProps<T extends BaseProps, U extends Partial<T>>(
  component: string,
  defaultProps: U,
  props: T
): UseInputPropsReturnType {
  const [local, others] = splitProps<
    T,
    [readonly (keyof T)[], ...(readonly (keyof T)[])[]]
  >(useComponentDefaultProps<T>(component, defaultProps, props), [
    "ref",
    "label",
    "description",
    "error",
    "required",
    "classNames",
    "styles",
    "className",
    "unstyled",
    "__staticSelector",
    "sx",
    "errorProps",
    "labelProps",
    "descriptionProps",
    "wrapperProps",
    "id",
    "size",
    "style",
    "inputContainer",
    "inputWrapperOrder",
    "withAsterisk",
  ]);

  const uid = useId(local.id);

  const { systemStyles, rest } = extractSystemStyles(others);

  return mergeProps(rest, {
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    ref: local.ref,

    wrapperProps: {
      label: local.label,
      description: local.description,
      error: local.error,
      required: local.required,
      classNames: local.classNames,
      className: local.className,
      __staticSelector: local.__staticSelector,
      sx: local.sx,
      errorProps: local.errorProps,
      labelProps: local.labelProps,
      descriptionProps: local.descriptionProps,
      unstyled: local.unstyled,
      styles: local.styles,
      id: uid,
      size: local.size,
      style: local.style,
      inputContainer: local.inputContainer,
      inputWrapperOrder: local.inputWrapperOrder,
      withAsterisk: local.withAsterisk,
      ...local.wrapperProps,
      ...systemStyles,
    },
    inputProps: {
      required: local.required,
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
      id: uid,
      size: local.size,
      __staticSelector: local.__staticSelector,
      invalid: !!local.error,
    },
  });
}
