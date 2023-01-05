import {
  ComponentProps,
  createMemo,
  JSXElement,
  Show,
  splitProps,
} from "solid-js";
import { MantineSize, Selectors, DefaultProps, MantineColor } from "styles";
import { Box } from "../../Box";
import { StarSymbol } from "../StarSymbol/StarSymbol";
import useStyles from "./RatingItem.styles";

export type RatingItemStylesNames = Selectors<typeof useStyles>;

export interface RatingItemProps
  extends DefaultProps<RatingItemStylesNames>,
    Omit<ComponentProps<"input">, "value" | "size"> {
  size: MantineSize;
  getSymbolLabel: (value: number) => string;
  emptyIcon?: JSXElement | ((value: number) => JSXElement);
  fullIcon?: JSXElement | ((value: number) => JSXElement);
  color: MantineColor;
  full: boolean;
  active: boolean;
  fractionValue: number;
  value: number;
  id: string;
}

export function RatingItem(props: RatingItemProps) {
  const [local, others] = splitProps(props, [
    "size",
    "getSymbolLabel",
    "emptyIcon",
    "fullIcon",
    "full",
    "active",
    "value",
    "readOnly",
    "fractionValue",
    "classNames",
    "styles",
    "unstyled",
    "color",
    "id",
  ]);

  const { classes } = useStyles(null, {
    name: "Rating",
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
  });

  const _fullIcon = createMemo(() =>
    typeof local.fullIcon === "function"
      ? local.fullIcon(local.value)
      : local.fullIcon
  );

  const _emptyIcon = createMemo(() =>
    typeof local.emptyIcon === "function"
      ? local.emptyIcon(local.value)
      : local.emptyIcon
  );

  return (
    <>
      <Show when={!local.readOnly}>
        <input
          className={classes.input}
          id={local.id}
          type="radio"
          data-active={local.active}
          aria-label={local.getSymbolLabel(local.value)}
          value={local.value}
          {...others}
        />
      </Show>

      <Box
        component={local.readOnly ? "div" : "label"}
        className={classes.label}
        data-read-only={local.readOnly || undefined}
        for={local.id}
        sx={
          local.fractionValue === 1
            ? undefined
            : { zIndex: local.active ? 2 : 0 }
        }
      >
        <Box
          className={classes.symbolBody}
          sx={
            local.fractionValue === 1
              ? undefined
              : {
                  clipPath: `inset(0 ${
                    local.active ? 100 - local.fractionValue * 100 : 100
                  }% 0 0)`,
                }
          }
        >
          {local.full
            ? _fullIcon() || (
                <StarSymbol color={local.color} size={local.size} type="full" />
              )
            : _emptyIcon() || (
                <StarSymbol
                  color={local.color}
                  size={local.size}
                  type="empty"
                />
              )}
        </Box>
      </Box>
    </>
  );
}

RatingItem.displayName = "@mantine/core/RatingItem";
