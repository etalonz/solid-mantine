import { mergeRefs } from "@solid-primitives/refs";
import { Component, createEffect, createMemo, JSX, splitProps } from "solid-js";
import calculateNodeHeight from "./calculateNodeHeight";
import getSizingData, { SizingData } from "./getSizingData";
import { useWindowResizeListener } from "./hooks";

type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Style = Omit<
  NonNullable<TextareaProps["style"]>,
  "maxHeight" | "minHeight"
> & {
  height?: string;
};

export type TextareaHeightChangeMeta = {
  rowHeight: number;
};
export interface TextareaAutosizeProps extends Omit<TextareaProps, "style"> {
  maxRows?: number;
  minRows?: number;
  onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void;
  cacheMeasurements?: boolean;
  style?: Style;
}

const TextareaAutosize: Component<TextareaAutosizeProps> = (props_) => {
  const [local, props] = splitProps(props_, [
    "ref",
    "cacheMeasurements",
    "maxRows",
    "minRows",
    "onChange",
    "onHeightChange",
  ]);

  if (process.env.NODE_ENV !== "production" && props.style) {
    if ("maxHeight" in props.style) {
      throw new Error(
        "Using `style.maxHeight` for <TextareaAutosize/> is not supported. Please use `maxRows`."
      );
    }
    if ("minHeight" in props.style) {
      throw new Error(
        "Using `style.minHeight` for <TextareaAutosize/> is not supported. Please use `minRows`."
      );
    }
  }
  const isControlled = createMemo(() => props.value !== undefined);

  let libRef: HTMLTextAreaElement | null = null;
  let heightRef = 0;
  let measurementsCacheRef: SizingData;

  const resizeTextarea = () => {
    const node = libRef;
    const nodeSizingData =
      local.cacheMeasurements && measurementsCacheRef
        ? measurementsCacheRef
        : getSizingData(node);

    if (!nodeSizingData) {
      return;
    }

    measurementsCacheRef = nodeSizingData;

    const [height, rowHeight] = calculateNodeHeight(
      nodeSizingData,
      node.value || node.placeholder || "x",
      local.minRows,
      local.maxRows
    );

    if (heightRef !== height) {
      heightRef = height;
      node.style.setProperty("height", `${height}px`, "important");
      local.onHeightChange?.(height, { rowHeight });
    }
  };

  const handleChange = (event: Event) => {
    if (!isControlled()) {
      resizeTextarea();
    }
    (local.onChange as any)?.(event);
  };

  if (typeof document !== "undefined") {
    createEffect(resizeTextarea);
    useWindowResizeListener(resizeTextarea);
  }

  return (
    <textarea
      {...props}
      onKeyDown={handleChange}
      ref={mergeRefs((e) => (libRef = e), local.ref)}
    />
  );
};

export default TextareaAutosize;
