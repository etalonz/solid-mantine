import { ComponentProps, For, splitProps } from "solid-js";
import { DefaultProps, Selectors } from "styles";
import { ColorSwatch } from "../../ColorSwatch/ColorSwatch";
import useStyles from "./Swatches.styles";

export type SwatchesStylesNames = Selectors<typeof useStyles>;

export interface SwatchesProps
  extends DefaultProps<SwatchesStylesNames>,
    Omit<ComponentProps<"div">, "onSelect"> {
  data: string[];
  swatchesPerRow?: number;
  focusable?: boolean;
  onChangeEnd?: (color: string) => void;
  __staticSelector?: string;
  setValue(value: string): void;
}

export function Swatches(props: SwatchesProps) {
  // swatchesperrow =  10, focusable = true, __staticSelector= color-picker
  const [local, others] = splitProps(props, [
    "data",
    "swatchesPerRow",
    "focusable",
    "classNames",
    "styles",
    "__staticSelector",
    "unstyled",
    "setValue",
    "onChangeEnd",
  ]);

  const { classes } = useStyles(
    { swatchesPerRow: local.swatchesPerRow || 10 },
    {
      classNames: local.classNames,
      styles: local.styles,
      name: local.__staticSelector || "color-picker",
      unstyled: local.unstyled,
    }
  );

  return (
    <div className={classes.swatches} {...others}>
      <For each={local.data}>
        {(color) => (
          <ColorSwatch
            className={classes.swatch}
            component="button"
            type="button"
            color={color}
            radius="sm"
            onClick={() => {
              props.setValue(color);
              props.onChangeEnd?.(color);
            }}
            style={{ cursor: "pointer" }}
            aria-label={color}
            tabIndex={props.focusable === undefined || props.focusable ? 0 : -1}
          />
        )}
      </For>
    </div>
  );
}

Swatches.displayName = "@mantine/core/Swatches";
