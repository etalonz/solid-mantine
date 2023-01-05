import { FlowProps, splitProps } from "solid-js";
import { ComponentWithRef, DefaultProps } from "styles";
import { createPolymorphicComponent, packSx } from "utils";
import { Box } from "../../../Box";

export interface SectionProps extends DefaultProps, FlowProps {
  /** Force section to take all available height */
  grow?: boolean;
}

export const _Section: ComponentWithRef<SectionProps, HTMLDivElement> = (
  props
) => {
  const [local, others] = splitProps(props, ["children", "grow", "sx"]);
  return (
    <Box
      sx={[
        { flex: local.grow ? 1 : 0, boxSizing: "border-box" },
        ...packSx(local.sx),
      ]}
      {...others}
    >
      {local.children}
    </Box>
  );
};

_Section.displayName = "@mantine/core/Section";

export const Section = createPolymorphicComponent<"div", SectionProps>(
  _Section
);
