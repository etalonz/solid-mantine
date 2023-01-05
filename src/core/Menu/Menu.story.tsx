import { IconTable, IconSearch } from "solid-tabler-icons";
//import { WithinOverlays } from "@mantine/storybook";
import { Menu } from "./Menu";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip";
import { Text } from "../Text";
import { createSignal } from "solid-js";

export default { title: "Menu" };

export function Usage() {
  return (
    <div
      style={{ padding: "40px", display: "flex", "justify-content": "center" }}
    >
      <Menu width={"200px"} shadow="md">
        <Menu.Target>{(p) => <Button {...p}>Toggle menu</Button>}</Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Label 1</Menu.Label>
          <Menu.Item component="a" href="https://google.com">
            Link item
          </Menu.Item>
          <Menu.Item closeMenuOnClick={false}>
            Won&apos;t close on click
          </Menu.Item>
          <Menu.Item disabled>Disabled</Menu.Item>

          <Menu.Item
            icon={<IconSearch size={14} />}
            rightSection={
              <Text size="xs" color="dimmed">
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Label 2</Menu.Label>
          <Menu.Item color="red" icon={<IconTable size={14} />}>
            Red color
          </Menu.Item>
          <Menu.Item icon={<IconTable size={14} />}>Button item 3</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

/*export function _WithinOverlays() {
  return (
    <WithinOverlays>
      <Usage />
    </WithinOverlays>
  );
}*/

export function MenuTargetWithTooltip() {
  return (
    <div style={{ padding: "40px" }}>
      <Menu>
        <Tooltip label="Tooltip first">
          <Menu.Target>
            {(p) => <Button {...p}>Tooltip first</Button>}
          </Menu.Target>
        </Tooltip>

        <Menu.Dropdown>
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu>
        <Menu.Target>
          {(p) => (
            <Tooltip {...p} label="Tooltip last">
              <Button ml="xl">Tooltip last</Button>
            </Tooltip>
          )}
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export function Controlled() {
  const [opened, setOpened] = createSignal(false);
  return (
    <div style={{ padding: "100px" }}>
      <Menu opened={opened()} onChange={setOpened}>
        <Menu.Target>
          {(p) => <Button {...p}>Toggle controlled menu</Button>}
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item>Item 2</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
