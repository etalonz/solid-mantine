import { useDisclosure } from "hooks";
import { MANTINE_SIZES } from "styles";
import { IconSearch } from "solid-tabler-icons";
import { ActionIcon } from "../ActionIcon/ActionIcon";
import { Input } from "./Input";

function ValidInvalid() {
  const [valid, { toggle }] = useDisclosure(false);
  return (
    <div style={{ padding: "40px" }}>
      <Input invalid={valid()} placeholder="Hello there" />
      <Input
        style={{ "margin-top": "10px" }}
        variant="filled"
        invalid={valid()}
        placeholder="Hello there"
      />

      <button
        type="button"
        onClick={() => toggle()}
        style={{ "margin-top": "20px" }}
      >
        toggle
      </button>
    </div>
  );
}

const actionIcon = (
  <ActionIcon size="sm">
    <IconSearch />
  </ActionIcon>
);

const sizes = MANTINE_SIZES.map((size) => (
  <Input
    placeholder={`${size} input`}
    style={{ "margin-top": "15px" }}
    size={size}
  />
));

const getStates = (props?: any) => (
  <div style={{ "max-width": "400px", padding: "50px" }}>
    <Input placeholder="Text" {...props} />
    <Input placeholder="Tel" type="tel" style={{ marginTop: 15 }} {...props} />
    <Input
      placeholder="Number"
      type="number"
      {...props}
      style={{ marginTop: 15 }}
    />
    <Input
      placeholder="Search"
      type="search"
      {...props}
      style={{ marginTop: 15 }}
    />
    <Input
      placeholder="Email"
      type="email"
      {...props}
      style={{ marginTop: 15 }}
    />
    <Input placeholder="Url" type="url" {...props} style={{ marginTop: 15 }} />
    <Input
      placeholder="Invalid"
      icon={<IconSearch />}
      invalid
      style={{ marginTop: 15 }}
      {...props}
    />
    <Input
      placeholder="Disabled"
      disabled
      style={{ marginTop: 15 }}
      {...props}
    />
    <Input
      placeholder="With icon"
      icon={<IconSearch />}
      style={{ marginTop: 15 }}
      {...props}
    />
    <Input
      style={{ marginTop: 15 }}
      placeholder="With right section"
      rightSection={actionIcon}
      {...props}
    />
    <Input
      style={{ marginTop: 15 }}
      placeholder="Right Section width"
      rightSection={actionIcon}
      rightSectionWidth={50}
      {...props}
    />
  </div>
);

export default { title: "Input" };

export const Sizes = () => (
  <div style={{ "max-width": "400px", padding: "50px" }}>{sizes}</div>
);

export const DefaultVariant = () => <>{getStates({ variant: "default" })}</>;
export const FilledVariant = () => <>{getStates({ variant: "filled" })}</>;
export const UnstyledVariant = () => <>{getStates({ variant: "unstyled" })}</>;
export const CustomCombonentButton = () => (
  <>
    {getStates({ component: "button", children: "Input button" })}
    {getStates({
      variant: "filled",
      component: "button",
      children: "Input button",
    })}
    {getStates({
      variant: "unstyled",
      component: "button",
      children: "Input button",
    })}
  </>
);
export const CustomComponentTextarea = () => (
  <>
    {getStates({
      component: "textarea",
      inputStyle: { paddingTop: 9, paddingBottom: 9 },
    })}
    {getStates({
      variant: "filled",
      component: "textarea",
      inputStyle: { paddingTop: 9, paddingBottom: 9 },
    })}
    {getStates({
      variant: "unstyled",
      component: "textarea",
      inputStyle: { paddingTop: 9, paddingBottom: 9 },
    })}
  </>
);
export const InvalidToggle = () => <ValidInvalid />;
export const UnstyledInputWrapper = () => (
  <Input.Wrapper
    label="label"
    description="description"
    error="error"
    p={50}
    unstyled
  >
    {" "}
  </Input.Wrapper>
);
