import { ComponentProps, JSXElement, splitProps } from "solid-js";
import { DefaultProps, MantineSize, Selectors } from "styles";
import { Box } from "../Box";
import { Input } from "../Input";
import useStyles from "./InlineInput.styles";

export type InlineInputStylesNames = Selectors<typeof useStyles>;

export interface InlineInputProps
  extends DefaultProps<InlineInputStylesNames>,
    ComponentProps<"div"> {
  __staticSelector: string;
  label: JSXElement;
  description: JSXElement;
  id: string;
  disabled: boolean;
  error: JSXElement;
  size: MantineSize;
  labelPosition: "left" | "right";
}

export function InlineInput(props: InlineInputProps) {
  const [local, others] = splitProps(props, [
    "__staticSelector",
    "className",
    "classNames",
    "styles",
    "unstyled",
    "children",
    "label",
    "description",
    "id",
    "disabled",
    "error",
    "size",
    "labelPosition",
  ]);

  const { classes, cx } = useStyles(
    { size: local.size, labelPosition: local.labelPosition },
    {
      name: local.__staticSelector,
      styles: local.styles,
      classNames: local.classNames,
      unstyled: local.unstyled,
    }
  );

  return (
    <Box className={cx(classes.root, local.className)} {...others}>
      <div class={cx(classes.body)}>
        {local.children}

        <div class={classes.labelWrapper}>
          {local.label && (
            <label
              class={classes.label}
              data-disabled={local.disabled || undefined}
              for={local.id}
            >
              {local.label}
            </label>
          )}

          {local.description && (
            <Input.Description className={classes.description}>
              {local.description}
            </Input.Description>
          )}

          {local.error && local.error !== "boolean" && (
            <Input.Error className={classes.error}>{local.error}</Input.Error>
          )}
        </div>
      </div>
    </Box>
  );
}

InlineInput.displayName = "@mantine/core/InlineInput";
