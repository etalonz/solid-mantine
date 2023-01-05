import { FlowProps, splitProps } from "solid-js";
import {
  ComponentWithRef,
  DefaultProps,
  useComponentDefaultProps,
} from "styles";
import { packSx, createPolymorphicComponent } from "utils";
import { Box } from "../Box";

export interface CenterProps extends FlowProps<DefaultProps> {
  /** Set to true to use inline-flex instead of flex */
  inline?: boolean;
}

export const _Center: ComponentWithRef<CenterProps, HTMLDivElement> = (
  props
) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Center", {}, props),
    ["inline", "sx"]
  );
  return (
    <Box
      sx={[
        {
          display: local.inline ? "inline-flex" : "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ...packSx(local.sx),
      ]}
      {...others}
    />
  );
};

_Center.displayName = "@mantine/core/Center";

export const Center = createPolymorphicComponent<"div", CenterProps>(_Center);
