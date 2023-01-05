import { JSX, JSXElement, Show } from "solid-js";
import { MantineNumberSize } from "styles";
import { Group } from "../../Group/Group";
import { Stack } from "../../Stack/Stack";

interface InputsGroupProps {
  spacing: MantineNumberSize;
  offset: MantineNumberSize;
  orientation: "horizontal" | "vertical";
  role?: JSX.AriaAttributes["role"];
  children: JSXElement;
  unstyled?: boolean;
}

export function InputsGroup(p: InputsGroupProps) {
  return (
    <Show
      when={p.orientation === "horizontal"}
      fallback={() => (
        <Stack
          pt={p.offset}
          spacing={p.spacing}
          role={p.role}
          unstyled={p.unstyled}
        >
          {p.children}
        </Stack>
      )}
    >
      <Group
        pt={p.offset}
        spacing={p.spacing}
        role={p.role}
        unstyled={p.unstyled}
      >
        {p.children}
      </Group>
    </Show>
  );
}
