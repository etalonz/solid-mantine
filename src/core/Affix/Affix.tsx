import { ComponentProps, JSX, splitProps } from "solid-js";
import {
  DefaultProps,
  MantineStyleSystemSize,
  getDefaultZIndex,
  useComponentDefaultProps,
} from "styles";
import { packSx } from "utils";
import { Box } from "../Box";
import { OptionalPortal } from "../Portal";

export interface AffixProps
  extends Omit<DefaultProps, MantineStyleSystemSize>,
    ComponentProps<"div"> {
  /** Element where portal should be rendered, by default new div element is created and appended to document.body */
  target?: HTMLDivElement;

  /** Root element z-index property */
  zIndex?: JSX.CSSProperties["z-index"];

  /** Determines whether component should be rendered within portal, defaults to true */
  withinPortal?: boolean;

  /** Fixed position in px, defaults to { bottom: 0, right: 0 } */
  position?: {
    top?: string | number;
    left?: string | number;
    bottom?: string | number;
    right?: string | number;
  };
}

const defaultProps: Partial<AffixProps> = {
  position: { bottom: 0, right: 0 },
  zIndex: getDefaultZIndex("modal"),
  withinPortal: true,
};

export const Affix = (props: AffixProps) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("Affix", defaultProps, props),
    ["target", "position", "zIndex", "sx", "withinPortal"]
  );

  return (
    <OptionalPortal withinPortal={local.withinPortal} target={local.target}>
      <Box
        sx={[
          { position: "fixed", zIndex: local.zIndex, ...local.position },
          ...packSx(local.sx),
        ]}
        {...others}
      />
    </OptionalPortal>
  );
};

Affix.displayName = "@mantine/core/Affix";
