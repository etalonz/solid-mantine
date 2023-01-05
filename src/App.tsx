import { Component, createMemo, createSignal, onMount } from "solid-js";
import { Box } from "core/Box/Box";
import { UnstyledButton } from "core/UnstyledButton";
import { Button } from "core/Button";
import { Text } from "core/Text";
import { Input } from "core/Input";
import { TextInput } from "core/TextInput";
import { AppShell } from "core/AppShell";
import { Navbar } from "core/AppShell";
import { Header } from "core/AppShell";
import { Footer } from "core/AppShell";
import { Aside } from "core/AppShell";
import { useMantineTheme } from "styles";
import { Collapse } from "core/Collapse";
import { FileInput } from "core/FileInput";
import { FocusTrap } from "core/FocusTrap";
import { Accordion } from "core/Accordion";
import { NavLink } from "core/NavLink";
import { NumberInput } from "core/NumberInput";
import { Portal } from "core/Portal";
import { ScrollArea } from "core/ScrollArea";
import { SegmentedControl } from "core/SegmentedControl";
import { Tabs } from "core/Tabs";
import { Textarea } from "core/Textarea";
import { Timeline } from "core/Timeline";
import { Popover } from "core/Popover";
import { SelectItems } from "core/Select/SelectItems/SelectItems";
import { DefaultItem } from "core/Select/DefaultItem/DefaultItem";
import { Select } from "core/Select";

import { Stack } from "core/Stack";
import { Card } from "core/Card";
import { Checkbox } from "core/Checkbox";
import { CheckboxGroup } from "core/Checkbox/CheckboxGroup/CheckboxGroup";
import { Tooltip } from "core/Tooltip";
import { Drawer } from "core/Drawer";
import { HoverCard } from "core/HoverCard";
import { Menu } from "core/Menu";
import { Stepper } from "core/Stepper";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const [collapse, setCollapse] = createSignal(false);
  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          <Text>Application navbar</Text>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", "align-items": "center", height: "100%" }}
          >
            <Text>Application header</Text>
          </div>
        </Header>
      }
    >
      <Collapse in={collapse()} onClick={() => setCollapse((v) => !v)}>
        <Text>Resize app to see responsive navbar in action</Text>
      </Collapse>

      <App />
    </AppShell>
  );
}

const AdefaultProps = {
  transitionDuration: 100,
  children: () => (
    <>
      <Accordion.Item value="item-1">
        <Accordion.Control>Label 1</Accordion.Control>
        <Accordion.Panel>test-item-1</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Control>Label 2</Accordion.Control>
        <Accordion.Panel>test-item-2</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Control>Label 3</Accordion.Control>
        <Accordion.Panel>test-item-3</Accordion.Panel>
      </Accordion.Item>
    </>
  ),
};

const NLdefaultProps = {
  label: "test-link",
};

const SCdefaultProps = {
  transitionDuration: 200,
  data: [
    { label: "test-label-1", value: "test-value-1" },
    { label: "test-label-2", value: "test-value-2" },
    { label: "test-label-3", value: "test-value-3" },
  ],
};

function Content() {
  return (
    <>
      <Text size="xl" weight={700}>
        Charizard (Pokémon)
      </Text>
      <Text color="dimmed">Charizard description from Bulbapedia</Text>
      <Text size="sm" mt="md">
        Charizard is a draconic, bipedal Pokémon. It is primarily orange with a
        cream underside from the chest to the tip of its tail. It has a long
        neck, small blue eyes, slightly raised nostrils, and two horn-like
        structures protruding from the back of its rectangular head. There are
        two fangs visible in the upper jaw when its mouth is closed. Two large
        wings with blue-green undersides sprout from its back, and a horn-like
        appendage juts out from the top of the third joint of each wing. A
        single wing-finger is visible through the center of each wing membrane.
        Charizard&apos;s arms are short and skinny compared to its robust belly,
        and each limb has three white claws. It has stocky legs with
        cream-colored soles on each of its plantigrade feet. The tip of its
        long, tapering tail burns with a sizable flame.
      </Text>
      <Text size="sm" mt="md">
        As Mega Charizard X, its body and legs are more physically fit, though
        its arms remain thin. Its skin turns black with a sky-blue underside and
        soles. Two spikes with blue tips curve upward from the front and back of
        each shoulder, while the tips of its horns sharpen, turn blue, and curve
        slightly upward. Its brow and claws are larger, and its eyes are now
        red. It has two small, fin-like spikes under each horn and two more down
        its lower neck. The finger disappears from the wing membrane, and the
        lower edges are divided into large, rounded points. The third joint of
        each wing-arm is adorned with a claw-like spike. Mega Charizard X
        breathes blue flames out the sides of its mouth, and the flame on its
        tail now burns blue. It is said that its new power turns it black and
        creates more intense flames.
      </Text>
    </>
  );
}

const App: Component = () => {
  const [margin, setMargin] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const content = createMemo(() => margin().toString());
  const element = document.createElement("div");

  onMount(() => {
    console.log(element.querySelector(".test-portal"));
  });

  return (
    <Stack spacing={5}>
      <Box
        mt={margin()}
        sx={{ padding: 15, marginBottom: margin() }}
        component="button"
        onClick={() =>
          setMargin((v) => {
            console.log("margin was", v);
            return v + 1;
          })
        }
      >
        helo
        <p>cica</p>
        <span>{content()}</span>
      </Box>
      <UnstyledButton ml={margin()}>hi</UnstyledButton>
      <Button loading={loading()}>Basic Button</Button>
      <Button variant="light">Light Button</Button>
      <Button onClick={() => setLoading((p) => !p)}>Toggle Loading</Button>
      <Text>Basic Text</Text>
      <Input>Input?</Input>
      <TextInput label="Input" onChange={() => console.log("runs")} />
      <FileInput multiple required />
      <FocusTrap>
        <div>
          <input />
          <button type="button">Button</button>
        </div>
      </FocusTrap>

      <ScrollArea style={{ height: "300px" }}>
        <Content />
      </ScrollArea>

      <Accordion {...AdefaultProps} defaultValue="item-2" />

      <NavLink
        {...NLdefaultProps}
        rightSection="test-right-section"
        defaultOpened
        disableRightSectionRotation
      >
        <div>test-dropdown</div>
      </NavLink>

      <NumberInput />

      <NumberInput
        max={10}
        min={0}
        step={6}
        onChange={(v) => console.log(v)}
        decimalSeparator=","
      />

      <input onChange={(e) => console.log(e)} oninput={(e) => console.log(e)} />

      <Portal className="test-portal" target={element}>
        test-portal
      </Portal>

      <SegmentedControl {...SCdefaultProps} />

      <Tabs defaultValue="tab-1" allowTabDeactivation>
        <Tabs.List aria-label="test-tabs">
          <Tabs.Tab value="tab-1">tab-1</Tabs.Tab>
          <Tabs.Tab value="tab-2">tab-2</Tabs.Tab>
          <Tabs.Tab value="tab-3">tab-3</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab-1">tab-1 panel</Tabs.Panel>
        <Tabs.Panel value="tab-2">tab-2 panel</Tabs.Panel>
        <Tabs.Panel value="tab-3">tab-3 panel</Tabs.Panel>
      </Tabs>

      <Textarea
        value={SCValue()}
        onChange={(e) => setSCValue(e.target.value)}
      />

      <Timeline
        active={1}
        items={[
          { title: "Hello", bullet: "$", children: () => 2 },
          { children: () => 2 },
          { children: () => 3 },
        ]}
      />

      <Popover transitionDuration={0} defaultOpened={true} trapFocus={false}>
        <Popover.Target>
          <Box component="button" type="button">
            test-target
          </Box>
        </Popover.Target>

        <Popover.Dropdown>
          <div>test-dropdown</div>
          <input aria-label="1" />
          <input aria-label="2" data-autofocus />
          <input aria-label="3" />
        </Popover.Dropdown>
      </Popover>

      <SelectItems
        data={[
          { value: "react", label: "React" },
          { value: "ng", label: "Angular" },
          { value: "svelte", label: "Svelte" },
          { value: "vue", label: "Vue" },
        ]}
        hovered={hovered()}
        __staticSelector="Select"
        isItemSelected={() => false}
        uuid="test-id"
        itemsRefs={{}}
        onItemSelect={() => {}}
        size={"sm" as const}
        itemComponent={DefaultItem}
        nothingFound="test-nothing"
        onItemHover={setHovered}
      />

      <Select
        searchable
        initiallyOpened={true}
        label="test-label"
        withinPortal={false}
        data={[
          { value: "test-item-1", label: "Test item 1" },
          { value: "test-item-2", label: "Test item 2" },
        ]}
      ></Select>

      <Card p={10}>
        <Card.Section>section 1</Card.Section>
        <Card.Section>section 2</Card.Section>
        <Card.Section>section 3</Card.Section>
        <Card.Section>section 4</Card.Section>
      </Card>

      <Checkbox label="test-label" />
      <Checkbox checked={false} onChange={console.log} />

      <CheckboxGroup
        children={[
          () => <Checkbox value="test-value-1" label="test-label-1" />,
          () => <Checkbox value="test-value-2" label="test-label-2" />,
          () => <Checkbox value="test-value-3" label="test-label-3" />,
        ]}
        value={["test-value-2"]}
        onChange={console.log}
      />

      <Tooltip label="test-tooltip" transitionDuration={0}>
        <Box component="button" type="button">
          target
        </Box>
      </Tooltip>

      <HoverCard transitionDuration={0} initiallyOpened>
        <HoverCard.Target>
          <Box component="button" type="button">
            test-target
          </Box>
        </HoverCard.Target>
        <HoverCard.Dropdown>test-dropdown</HoverCard.Dropdown>
      </HoverCard>

      <MenuTestContainer
        onOpen={() => console.log("open")}
        onClose={() => console.log("close")}
      />

      <Stepper active={activeStep()}>
        <Stepper.Step label="0" description="0">
          test-step-content-0
        </Stepper.Step>
        <Stepper.Step label="1" description="1">
          test-step-content-1
        </Stepper.Step>
        <Stepper.Step label="2" description="2">
          test-step-content-2
        </Stepper.Step>
        <Stepper.Step label="3" description="3">
          test-step-content-3
        </Stepper.Step>
        <Stepper.Completed>test-step-completed</Stepper.Completed>
      </Stepper>

      <Button onClick={() => setActiveStep(3)}>Step to 3</Button>
    </Stack>
  );
};

const [activeStep, setActiveStep] = createSignal(1);

const [SCValue, setSCValue] = createSignal("test-value-2");
const [hovered, setHovered] = createSignal(-1);

function MenuTestContainer(props) {
  return (
    <Menu transitionDuration={0} closeDelay={0} openDelay={0} {...props}>
      <Menu.Target>
        <Box component="button" type="button">
          test-target
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>test-item-1</Menu.Item>
        <Menu.Item closeMenuOnClick={false}>test-item-2</Menu.Item>
        <Menu.Item closeMenuOnClick>test-item-3</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
