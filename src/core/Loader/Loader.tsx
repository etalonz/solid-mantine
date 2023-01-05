import {
  DefaultProps,
  MantineNumberSize,
  MantineColor,
  MantineTheme,
  useMantineTheme,
  useComponentDefaultProps,
} from "styles";
import { Box } from "../Box";
import { Bars } from "./loaders/Bars";
import { Oval } from "./loaders/Oval";
import { Dots } from "./loaders/Dots";
import { ComponentProps, splitProps } from "solid-js";

const LOADERS = {
  bars: Bars,
  oval: Oval,
  dots: Dots,
};

const sizes = {
  xs: 18,
  sm: 22,
  md: 36,
  lg: 44,
  xl: 58,
};

export interface LoaderProps
  extends DefaultProps,
    Omit<ComponentProps<"svg">, "ref"> {
  /** Defines width of loader */
  size?: MantineNumberSize;

  /** Loader color from theme */
  color?: MantineColor;

  /** Loader appearance */
  variant?: MantineTheme["loader"];
}

const defaultProps: Partial<LoaderProps> = {
  size: "md",
};

export function Loader(props: LoaderProps) {
  const [local, others] = splitProps(
    useComponentDefaultProps("Loader", defaultProps, props),
    ["size", "color", "variant"]
  );
  const theme = useMantineTheme();
  const defaultLoader = local.variant in LOADERS ? local.variant : theme.loader;

  return (
    <Box
      role="presentation"
      component={LOADERS[defaultLoader] || LOADERS.bars}
      size={theme.fn.size({ size: local.size, sizes })}
      color={
        theme.fn.variant({
          variant: "filled",
          primaryFallback: false,
          color: local.color || theme.primaryColor,
        }).background
      }
      {...others}
    />
  );
}

Loader.displayName = "@mantine/core/Loader";
