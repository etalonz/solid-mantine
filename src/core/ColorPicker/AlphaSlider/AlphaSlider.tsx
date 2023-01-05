import { createMemo, splitProps } from "solid-js";
import { useMantineTheme } from "styles";
import { ColorSlider, BaseColorSliderProps } from "../ColorSlider/ColorSlider";
import { round } from "../converters/parsers";

export interface AlphaSliderProps extends BaseColorSliderProps {
  color: string;
}

export const AlphaSlider = (props: AlphaSliderProps) => {
  const [local, others] = splitProps(props, [
    "value",
    "onChange",
    "onChangeEnd",
    "color",
  ]);
  const theme = useMantineTheme();
  const _color = createMemo(() =>
    theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
  );
  return (
    <ColorSlider
      {...others}
      value={local.value}
      onChange={(val) => local.onChange(round(val, 2))}
      onChangeEnd={(val) => local.onChangeEnd(round(val, 2))}
      maxValue={1}
      round={false}
      overlays={[
        {
          "background-image": `linear-gradient(45deg, ${_color} 25%, transparent 25%), linear-gradient(-45deg, ${_color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${_color} 75%), linear-gradient(-45deg, ${
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
          } 75%, ${_color} 75%)`,
          "background-size": "8px 8px",
          "background-position": "0 0, 0 4px, 4px -4px, -4px 0px",
        },
        {
          "background-image": `linear-gradient(90deg, transparent, ${local.color})`,
        },
        {
          "box-shadow":
            "rgba(0, 0, 0, .1) 0px 0px 0px 1px inset, rgb(0, 0, 0, .15) 0px 0px 4px inset",
        },
      ]}
    />
  );
};

AlphaSlider.displayName = "@mantine/core/AlphaSlider";
